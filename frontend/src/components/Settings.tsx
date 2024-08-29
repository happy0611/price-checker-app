import React, { useState, useEffect } from 'react';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  trackingMoney: number;
  trackingPeriod: number;
  updateInterval: number;
  onSave: (period: number, interval: number, money: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ open, onClose, trackingPeriod, updateInterval, trackingMoney, onSave }) => {
  const [money, setMoney] = useState<number>(trackingMoney);
  const [period, setPeriod] = useState<number>(trackingPeriod);
  const [interval, setInterval] = useState<number>(updateInterval);

  useEffect(() => {
    setMoney(trackingMoney); // `trackingMoney`が変更されたときに`money`も更新
  }, [trackingMoney]);

  if (!open) return null;  // モーダルが開いている場合のみ表示

  return (
    <div className="ui dimmer modals page visible active">
      <div className="ui standard modal visible active">
        <div className="header">トラッキング設定</div>
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>希望価格</label>
              <input
                type='number'
                value={money}
                onChange={(e) => setMoney(Number(e.target.value))}
                placeholder='0'
              />
            </div>
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
            <button className="ui primary button" onClick={() => onSave(period, interval, money)}>追跡開始</button>
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
