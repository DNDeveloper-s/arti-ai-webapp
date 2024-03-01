// Switch.tsx

import React, { useState } from 'react';
import Switch from 'react-switch';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SwitchComponent: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
    />
  );
};

export default SwitchComponent;
