import styled from 'styled-components';

export const EditorMain = styled.default.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
  overflow: hidden;
  position: relative
`;

export const EditorWindow = styled.default.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

export const EditorComponentPane = styled.default.div`
  flex: 1;
  position: relative;
  display: flex;
  background-color: rgb(243, 245, 246);
  box-sizing: border-box;
  height: 100%;
  flex-direction: column;
`;

export const EditorEntryFilePrompt = styled.default.div`
  min-height: 30px;
  background: white;
  font-family: Avenir;
  display: flex;
  font-size: 14px;
  font-weight: 400;
  max-height: 30px;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #EEE;
  & span {
    padding: 20px;
  }
`;
