import styled from 'styled-components';

export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
`;

export const PopupTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 8px;
  justify-content: center;
`;


export const PopupFeatureContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 4px;
  position: relative;
  background-color: #fff7f1;
  border-radius: 8px;
`;

export const PopupFeatureToggle = styled.input`
  appearance: none;
  background-color: #dfe1e4;
  border-radius: 72px;
  border-style: none;
  flex-shrink: 0;
  height: 20px;
  margin: 0;
  position: relative;
  width: 30px;
  cursor: pointer;

  &:focus:not(.focus - visible) {
    outline: 0;
  }

  &:before {
    bottom: -6px;
    content: "";
    left: -6px;
    position: absolute;
    right: -6px;
    top: -6px;
  }

  &:after { 
    transition: all 100ms ease - out;
    background-color: #fff;
    border-radius: 50%;
    content: "";
    height: 14px;
    left: 3px;
    position: absolute;
    top: 3px;
    width: 14px;
  }

  &:hover {
    background-color: #c9cbcd;
    transition-duration: 0s;
  }

  &:checked {
    background-color: #FFC55A;
  }

  &:checked::after { 
    background-color: #fff;
    left: 13px;
  } 

  &:checked::hover {
    background - color: #535db3;
  }
`;