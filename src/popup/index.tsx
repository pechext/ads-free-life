import React, { ChangeEvent, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PopupContainer, PopupFeatureContainer, PopupFeatureToggle, PopupTitleContainer } from './option.styled';
import { MESSAGES } from '../constants';
import SettingsHelper from '../settings/helper';
import { SettingsFeatures } from '../settings/model';

const rootElement = document.getElementById('popuproot');
const root = createRoot(rootElement!);

export default function Popup() {
  const [features, setFeatures] = useState<SettingsFeatures>();

  useEffect(() => {
    SettingsHelper.registerListener(loadSettings);
    return () => {
      SettingsHelper.unregisterListener(loadSettings);
    };
  }, []);

  const loadSettings = () => {
    SettingsHelper.getFeatures().then(setFeatures);
  };

  const onToggle = (e: ChangeEvent) => {
    const newState = (e.target as HTMLInputElement).checked;
    const featureKey = (e.target as HTMLInputElement).name;
    const message: Message<ToggleFeatureMessageData> = { name: MESSAGES.TOGGLE_FEATURE, data: { featureKey: featureKey, featureState: newState } };
    chrome.runtime.sendMessage(message);
  };

  const PopupFeatures = (props: { features?: SettingsFeatures; }): JSX.Element => {
    const featuresElements: JSX.Element[] = [];

    if (!props.features) return <div></div>;

    for (const featureKey in props.features) {
      featuresElements.push((
        <PopupFeatureContainer key={featureKey}>
          <h4>{props.features[featureKey].name}</h4>
          <PopupFeatureToggle type="checkbox" name={featureKey} onChange={onToggle} checked={props.features[featureKey].state} />
        </PopupFeatureContainer>
      ));
    }

    return (
      <div style={{ width: "100%" }}>{featuresElements}</div>
    );
  };

  return (
    <PopupContainer>
      <PopupTitleContainer>
        <img src="images/48.png"></img>
        <h2>Coco Blocker</h2>
      </PopupTitleContainer>
      <PopupFeatures features={features} />
    </PopupContainer>
  );
};

root.render(
  <Popup />
);