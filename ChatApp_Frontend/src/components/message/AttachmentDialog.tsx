import React from 'react';
import { X, Camera, Image, FileText, MapPin, User, Music } from 'lucide-react';

interface AttachmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const AttachmentDialog: React.FC<AttachmentDialogProps> = ({ isOpen, onClose, isDark }) => {
  const attachmentOptions = [
    { icon: Camera, label: 'Camera', color: 'bg-pink-500', action: () => console.log('Camera') },
    { icon: Image, label: 'Gallery', color: 'bg-purple-500', action: () => console.log('Gallery') },
    { icon: FileText, label: 'Document', color: 'bg-blue-500', action: () => console.log('Document') },
    { icon: User, label: 'Contact', color: 'bg-green-500', action: () => console.log('Contact') },
    { icon: MapPin, label: 'Location', color: 'bg-red-500', action: () => console.log('Location') },
    { icon: Music, label: 'Audio', color: 'bg-orange-500', action: () => console.log('Audio') },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center">
      <div className={`w-full max-w-sm mx-4 mb-4 md:mb-0 rounded-2xl shadow-2xl ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Share Content
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Attachment Options */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {attachmentOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.action();
                  onClose();
                }}
                className="flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`w-12 h-12 rounded-full ${option.color} flex items-center justify-center text-white`}>
                  <option.icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentDialog;