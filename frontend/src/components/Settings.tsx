import React, { useState } from 'react';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  trackingPeriod: number;
  updateInterval: number;
  onSave: (period: number, interval: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ open, onClose, trackingPeriod, updateInterval, onSave }) => {
  const [period, setPeriod] = useState(trackingPeriod);
  const [interval, setInterval] = useState(updateInterval);

  if (!open) return null;

  const handleSave = () => {
    onSave(period, interval);
    onClose();
  };

  return (
    <div className="ui dimmer modals page visible active">
      <div className="ui standard modal visible active">
        <div className="header">スクレイピング設定</div>
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>トラッキング期間 (日)</label>
              <input 
                type='number' 
                value={period} 
                onChange={(e) => setPeriod(Number(e.target.value))} 
                placeholder='7' 
              />
            </div>
            <div className="field">
              <label>更新間隔 (分)</label>
              <input 
                type='number' 
                value={interval} 
                onChange={(e) => setInterval(Number(e.target.value))} 
                placeholder='5' 
              />
            </div>
            <button className="ui primary button" onClick={handleSave}>追跡開始</button>
          </div>
        </div>
        <div className="actions">
          <button className="ui button" onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
