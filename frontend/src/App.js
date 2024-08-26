
import './App.css';
import { FamDiagram } from 'basicprimitivesreact';
import { PageFitMode, Enabled, GroupByType } from 'basicprimitives';
import { useEffect, useState } from 'react';

function App() {
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isValidDescription, setIsValidDescription] = useState(true);

  const [famDiagramConfig, setFamDiagramConfig] = useState({});

  const [base64MaleImage, setBase64MaleImage] = useState('');
  const [base64FemaleImage, setBase64FemaleImage] = useState('');
  const [base64UnknownImage, setBase64UnknownImage] = useState('');


  useEffect(() => {
    (async () => {
      await imageToBase64("./male-icon.jpg", setBase64MaleImage);
      await imageToBase64("./female-icon.jpg", setBase64FemaleImage);
      await imageToBase64("./unknown-person-icon.jpg", setBase64UnknownImage);
    })()
  }, []);

  const imageToBase64 = async (imageUrl, setState) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setState(base64Image);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }


  const handler = async () => {
    try {
      setIsValidDescription(true);
      if (description === '') {
        alert('Please enter family description');
        return;
      }
      setProcessing(true);
      const res = await fetch('http://localhost:8000/family-tree/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
      })
      const data = await res.json();

      if(!data?.isValidFamilyDescription) {
        setIsValidDescription(false);
        return setProcessing(false);
      }

      let items = [];
      for (let item of data?.tree) {
        items.push({
          id: item.node,
          parents: item.parents,
          title: item.node,
          description: item.relationNameWithUser,
          isActive: false,
          image: item.gender?.toLowerCase() === "male" ? base64MaleImage : item?.gender?.toLowerCase() === "female" ? base64FemaleImage : base64UnknownImage,
          itemTitleColor: item.node === "You" ? "#ffd11a" : "#4169e1"
        });
      }

      // The description provided does not contain sufficient information about family members or their relationships. Please provide a more detailed description of the family relationships you would like to include in the family tree.

      setFamDiagramConfig({
        pageFitMode: PageFitMode.AutoSize,
        autoSizeMinimum: { width: 100, height: 100 },
        cursorItem: 2,
        linesWidth: 1,
        arrowsDirection: GroupByType.Parents,
        showExtraArrows: true,
        linesColor: 'black',
        normalLevelShift: 20,
        dotLevelShift: 20,
        lineLevelShift: 20,
        normalItemsInterval: 10,
        dotItemsInterval: 30,
        lineItemsInterval: 30,
        hasSelectorCheckbox: Enabled.True,
        centerOnCursor: true,
        highlightItem: 0,
        items
      })
      setProcessing(false);
    } catch (error) {
      console.error('Error fetching family tree:', error);
      alert("Error fetching family tree. Please try again.");
      setProcessing(false);
    }
  }

  return (
    <div className='flex flex-col justify-center items-center py-5 space-y-8'>
      <h1 className='text-4xl font-bold'>Family Diagram</h1>
      <div className='flex flex-col items-center justify-center space-y-3'>
        <textarea value={description} onChange={e => setDescription(e.target.value)} className='border-2 outline-none rounded-lg border-gray-200 hover:border-black p-4' type="text" placeholder="Enter family description" cols="60" rows="4" />
        <button onClick={handler} className='px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 hover:text-white'>Form Tree</button>
      </div>

      {
        !isValidDescription ?
          <div className='flex items-center justify-center w-1/2'>
            <div className='text-red-600 font-medium'>The description provided does not contain sufficient information about family members or their relationships. Please provide a more detailed description of the family relationships you would like to include in the family tree.</div>
          </div>
        :
        processing ?
          <div className='flex items-center justify-center pt-20'>
            <div className="mr-2 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-black"></div>
            <span>Loading...</span>
          </div>
          : <div className="App">
            <FamDiagram centerOnCursor={true} config={famDiagramConfig} />
          </div>
      }

    </div>
  );
}

export default App;
