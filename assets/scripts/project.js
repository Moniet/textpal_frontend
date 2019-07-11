// selecting necessary elements
function projectPageInit() {

  const artboard = document.querySelector('.artboard');
  const fontSizeInput = document.querySelector('.font_size');
  const fontColorInput = document.querySelector('.font_color');
  const bgColorInput = document.querySelector('.bg_color');
  const sidebar = document.querySelector('.sidebar');
  const backDrop = document.querySelector('.backdrop');

  // *selecting* tools
  const selectTool = document.querySelector('.select_tool');
  const cursorTool = document.querySelector('.cursor_tool');
  const fontFace = document.querySelector('.font_face');
  const fontFaceMenu = document.querySelector('.font_face_menu');
  const boldTool = document.querySelector('.bold');
  const italicTool = document.querySelector('.italic');
  const underlineTool = document.querySelector('.underline');
  const alignLeftTool = document.querySelector('.align_text_left');
  const alignRightTool = document.querySelector('.align_text_right');
  const alignCenterTool = document.querySelector('.align_text_center');
  const fontTypeTools = document.querySelectorAll('.font_type');
  const addTextBoxTool = document.querySelector('.add_text_box');
  const removeTextBoxTool = document.querySelector('.remove_text_box');
  const dropShadowWrapper = document.querySelector('.dropshow_wrapper');

  let fontSize = 20;
  let selectedText;
  let fontType;
  let currentTool;

  function showHideFontFaceMenu() {
    let fontMenuDisplay = fontFaceMenu.style.display;

    if (fontMenuDisplay === 'none' || fontMenuDisplay === '') {
      fontFaceMenu.style.display = 'block';
    } else {
      fontFaceMenu.style.display = 'none';
    }
  }

  function getStyle(prop) {
    let el = window.getComputedStyle(selectedText);
    let style = el.getPropertyValue(prop);
    return style;
  }

  function updateValues(e) {
    updateSelectedText(e);
    updateFontSize();
    updateFontColor();
  }

  function updateSelectedText(e) {
    selectedText = e.target;
  }

  function updateFontSize() {
    let size = getStyle('font-size');
    fontSizeInput.value = parseInt(size);
  }

  function updateFontColor() {
    let fontColor = getStyle('color');
    fontColorInput.value = fontColor;
    console.log(`font color: ${fontColor}`);
  }

  function setFontSize(e) {
    let value = e.target.value;
    selectedText.style.fontSize = `${value}px`;
  }

  function setFontType(e) {
    fontType = e.target.dataset.fontType;

    if (selectedText !== '') {
      let el = document.createElement(fontType);
      el.textContent = selectedText.textContent;
      let styles = selectedText.style.cssText;
      el.style.cssText = styles;
      backDrop.replaceChild(el, selectedText);
      selectedText = el;
      if (currentTool === 'select') {
        selectedText.contentEditable = 'true';
      }
    }
  }

  function resetTextListeners() {
    let children = backDrop.childNodes;

    for (let child of children) {
      let newchild = child.cloneNode(true);
      newchild.contentEditable = 'false';
      newchild.className = '';
      backDrop.replaceChild(newchild, child);
    }
  }

  function setDropShadow() {
    let x = document.querySelector('.drop_shadow_x').value;
    let y = document.querySelector('.drop_shadow_y').value;
    let opacity = document.querySelector('.drop_shadow_opacity').value;
    let blur = document.querySelector('.drop_shadow_blur').value;
    let color = document.querySelector('.drop_shadow_color').value;

    let newColor = color.split(',').splice(3, 1, `${opacity})`);

    selectedText.style.textShadow = `${x}px ${y}px ${blur}px ${color}`;
    // console.log(`${x}px ${y}px ${blur}px ${color}`);
  }

  function setToolToSelect(e) {
    resetTextListeners();

    backDrop.childNodes.forEach(child => {
      child.contentEditable =  'true';
      child.addEventListener('click', e => {
        updateValues(e);
      });
    });

    currentTool = 'select';
    backDrop.style.cursor = "url('./assets/icons/select_tool.svg'), auto";
  }

  function setFontColor(e) {
    let color = e.target.value;
    selectedText.style.color = color;
  }

  function setFontToBold() {
    let fontWeight = getStyle('font-weight');

    if (parseInt(fontWeight) > 500) {
      selectedText.style.fontWeight = 500;
    } else {
      selectedText.style.fontWeight = 'bold';
    }

    console.log(`font-weight: ${fontWeight}`);
  }

  function setFontToItalic() {
    let fontStyle = getStyle('font-style');
    if (fontStyle === 'italic') {
      selectedText.style.fontStyle = 'normal';
    } else {
      selectedText.style.fontStyle = 'italic';
    }
  }

  function setFontToUnderline() {
    let textDecoration = getStyle('text-decoration');
    if (textDecoration === 'underline') {
      selectedText.style.textDecoration = 'none';
    } else {
      selectedText.style.textDecoration = 'underline';
    }
  }

  function setBackgroundColor(e) {
    let color = e.target.value;

    backDrop.style.backgroundColor = color;
  }

  function addTextBox() {
    let el = document.createElement(fontType);
    el.textContent = `I am an ${fontType} element`;
    if (currentTool === 'select') el.contentEditable = 'true';
    backDrop.appendChild(el);
    selectedText = el;
  }

  function removeTextBox() {
    selectedText.parentElement.removeChild(selectedText);
  }

  function createButton() {
    const createButton = document.createElement('button');
    createButton.innerText = 'Create new project';
    sidebar.append(createButton);
    createFunctionality(createButton);
  }

  function createFunctionality(createButton) {
    createButton.addEventListener('click', e => {
      const svg = backDrop.innerHTML.trim();
      const baseUrl = 'http://localhost:3000';
      projectData = { user_id: localStorage['id'], svg: svg };
      return fetch(`${baseUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      }).then(res => res.json()).then(alert('Project saved'));
    });
  }

  function createButton() {
    const createButton = document.createElement('button');
    createButton.className = 'btn btn-secondary col-md-12';
    createButton.innerText = 'save project';
    sidebar.append(createButton);
    createFunctionality(createButton);
  }

  function createFunctionality(createButton) {
    createButton.addEventListener('click', e => {
      resetTextListeners();
      const svg = artboard.innerHTML.trim();
      const baseUrl = 'http://localhost:3000';
      projectData = { user_id: localStorage['id'], svg: svg };
      return fetch(`${baseUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      }).then(res => res.json()).then(alert('Project saved'));
    });
  }

  function init() {
    createButton();
    const h1 = document.createElement('h1');
    const h2 = document.createElement('h2');
    h1.contentEditable = 'true';
    h2.contentEditable = 'true';
    h1.textContent = 'Welcome To Textpal';
    h2.textContent = 'Have some some and drop a shadow';
    selectedText = h1;
    fontType = 'p';
    backDrop.append(h1, h2);

    // tool event listeners
    selectTool.addEventListener('click', e => setToolToSelect(e));
    cursorTool.addEventListener('click', () => {
      resetTextListeners();
    });

    // input event listeners
    fontSizeInput.addEventListener('input', e => setFontSize(e));
    fontColorInput.addEventListener('change', e => setFontColor(e));
    bgColorInput.addEventListener('input', e => setBackgroundColor(e));
    boldTool.addEventListener('click', setFontToBold);
    italicTool.addEventListener('click', setFontToItalic);
    underlineTool.addEventListener('click', setFontToUnderline);
    fontFace.addEventListener('click', showHideFontFaceMenu);
    alignLeftTool.addEventListener('click', () => selectedText.style.textAlign = 'left');
    alignRightTool.addEventListener('click', () => selectedText.style.textAlign = 'right');
    alignCenterTool.addEventListener('click', () => selectedText.style.textAlign = 'center');
    addTextBoxTool.addEventListener('click', addTextBox);
    removeTextBoxTool.addEventListener('click', removeTextBox);
    dropShadowWrapper.addEventListener('input', setDropShadow);
    fontTypeTools.forEach(tool => {
      tool.addEventListener('click', setFontType);
    });
  }

  init();

}
