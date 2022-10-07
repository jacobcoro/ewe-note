import { useState } from 'react';
import useQuery from './useMediaQuery';

const useEditorDragBar = () => {
  const isMobile = useQuery('(min-width: 768px)');

  const [drag, setDrag] = useState({ iniMouse: 0, iniSize: 0 });
  const handleStart = (e: React.DragEvent<HTMLDivElement>) => {
    const editor = document.getElementById(`editor-section`);
    if (!editor) return;
    let iniMouse = isMobile ? e.clientY : e.clientX;
    let iniSize = isMobile ? e.clientY - 8 * 6.5 : editor.offsetWidth;
    setDrag({
      iniMouse: iniMouse,
      iniSize: iniSize,
    });
  };

  const handleMove = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.clientX) {
      const editor = document.getElementById(`editor-section`);
      if (!editor) return;
      let iniMouse = drag.iniMouse;
      let iniSize = drag.iniSize;
      let endMouse = isMobile ? e.clientY : e.clientX;

      if (isMobile) {
        let endSize = iniSize + (endMouse - iniMouse);
        editor.style.minHeight = `${endSize}px`;
        editor.style.width = '100%';
      } else {
        let endSize = iniSize - (endMouse - iniMouse);
        editor.style.width = `${endSize}px`;
        editor.style.height = '100%';
      }
    }
  };

  return { handleStart, handleMove };
};

export default useEditorDragBar;
