const ProgressBar = ({ currentStep }) => {
  const stages = [
    { number: 1, label: 'Cá nhân' },
    { number: 2, label: 'Liên lạc' },
    { number: 3, label: 'Địa chỉ' }
  ];

  return (
    <div className="progress-bar flex justify-between items-center relative">
      {/* Connecting Line */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 -z-10"></div>
      
      {stages.map((stage, index) => (
        <div key={stage.number} className="stage flex flex-col items-center relative">
          <p className="tool-tip text-sm text-gray-600 mb-2">{stage.label}</p>
          <div className={`stage-no w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm border-2 ${
            currentStep >= stage.number
              ? 'bg-amber-600 border-amber-600 text-white'
              : 'bg-white border-gray-300 text-gray-400'
          }`}>
            {stage.number}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;