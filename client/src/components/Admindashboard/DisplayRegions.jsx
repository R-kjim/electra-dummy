import React, { useState } from 'react';
import { FaFolder, FaFile, FaEdit, FaTrash } from 'react-icons/fa';

const RegionsTreeView = ({ regions, onAction }) => {
  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Regions</h2>
      {regions.map(county => (
        <TreeNode 
          key={county.id} 
          node={county} 
          label={county.county} 
          icon={<FaFolder className="h-5 w-5 text-gray-700" />} 
          onAction={onAction}
        />
      ))}
    </div>
  );
};
const TreeNode = ({ node, label, icon, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2">
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center cursor-pointer text-gray-800">
        {icon}
        <span className="ml-2 font-semibold">{label}</span>
      </div>
      {isOpen && (
        <div className="ml-6">
          {node.constituencies.map(constituency => (
            <TreeNode 
              key={constituency.id} 
              node={constituency} 
              label={constituency.name} 
              icon={<FaFolder className="h-5 w-5 text-gray-700" />} 
              onAction={onAction}
            />
          ))}
          {node.wards && node.wards.length > 0 && (
            <div className="ml-6">
              {node.wards.map(ward => (
                <div key={ward.id} className="flex items-center text-gray-700 justify-between">
                  <div className="flex items-center">
                    <FaFile className="h-4 w-4 text-gray-500" />
                    <span className="ml-2">{ward.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onAction('edit', ward)} 
                      className="text-blue-500 hover:underline"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => onAction('delete', ward)} 
                      className="text-red-500 hover:underline"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Sample data structure for testing
const regions = [
  {
    id: 1,
    county: 'Nairobi',
    constituencies: [
      {
        id: 1,
        name: 'Kibra',
        wards: [
          { id: 1, name: 'Kibra Ward' },
          { id: 2, name: 'Lindi Ward' },
        ],
      },
      {
        id: 2,
        name: 'Lang’ata',
        wards: [
          { id: 3, name: 'Kibera' },
          { id: 4, name: 'Lang’ata Ward' },
        ],
      },
    ],
  },
  {
    id: 2,
    county: 'Mombasa',
    constituencies: [
      {
        id: 3,
        name: 'Nyali',
        wards: [
          { id: 5, name: 'Nyali Ward' },
          { id: 6, name: 'Shanzu Ward' },
        ],
      },
    ],
  },
];

// Example usage
const DisplayRegions = () => {
  const handleAction = (actionType, region) => {
    if (actionType === 'edit') {
      console.log('Edit:', region);
      // Handle edit logic
    } else if (actionType === 'delete') {
      console.log('Delete:', region);
      // Handle delete logic
    }
  };

  return <RegionsTreeView regions={regions} onAction={handleAction} />;
};

export default DisplayRegions;
