import styled from '@emotion/styled';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 12px;
  max-width: 600px;
  background: #fff;

  label {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    gap: 4px;
  }

  input,
  select {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
  }

  button {
    padding: 10px 14px;
    background: #007bff;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 15px;
    cursor: pointer;
    transition: 0.2s;
  }

  button:disabled {
    background: #aaa;
    cursor: not-allowed;
  }
`;

export  const Error = styled.span`
  color: red;
  font-size: 12px;
`;
