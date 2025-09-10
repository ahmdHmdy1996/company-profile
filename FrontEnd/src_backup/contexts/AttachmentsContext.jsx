import React, { createContext, useReducer, useContext } from 'react';

// Attachments context
const AttachmentsContext = createContext();

// Attachments reducer
const attachmentsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ATTACHMENTS':
      return {
        ...state,
        attachments: action.payload,
      };
    case 'ADD_ATTACHMENT':
      return {
        ...state,
        attachments: [...state.attachments, action.payload],
      };
    case 'UPDATE_ATTACHMENT':
      return {
        ...state,
        attachments: state.attachments.map(attachment =>
          attachment.id === action.payload.id
            ? { ...attachment, ...action.payload.updates }
            : attachment
        ),
      };
    case 'REMOVE_ATTACHMENT':
      return {
        ...state,
        attachments: state.attachments.filter(
          attachment => attachment.id !== action.payload
        ),
      };
    case 'REORDER_ATTACHMENTS':
      return {
        ...state,
        attachments: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  attachments: [],
  loading: false,
  error: null,
};

// Attachments provider component
export const AttachmentsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(attachmentsReducer, initialState);

  // Set attachments
  const setAttachments = (attachments) => {
    dispatch({
      type: 'SET_ATTACHMENTS',
      payload: attachments,
    });
  };

  // Add attachment
  const addAttachment = (attachment) => {
    dispatch({
      type: 'ADD_ATTACHMENT',
      payload: attachment,
    });
  };

  // Update attachment
  const updateAttachment = (id, updates) => {
    dispatch({
      type: 'UPDATE_ATTACHMENT',
      payload: { id, updates },
    });
  };

  // Remove attachment
  const removeAttachment = (id) => {
    dispatch({
      type: 'REMOVE_ATTACHMENT',
      payload: id,
    });
  };

  // Reorder attachments
  const reorderAttachments = (newOrder) => {
    dispatch({
      type: 'REORDER_ATTACHMENTS',
      payload: newOrder,
    });
  };

  // Set loading state
  const setLoading = (loading) => {
    dispatch({
      type: 'SET_LOADING',
      payload: loading,
    });
  };

  // Set error
  const setError = (error) => {
    dispatch({
      type: 'SET_ERROR',
      payload: error,
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Get attachment by id
  const getAttachmentById = (id) => {
    return state.attachments.find(attachment => attachment.id === id);
  };

  // Get attachments count
  const getAttachmentsCount = () => {
    return state.attachments.length;
  };

  // Get total size of all attachments
  const getTotalSize = () => {
    return state.attachments.reduce((total, attachment) => total + attachment.size, 0);
  };

  // Check if attachment exists
  const hasAttachment = (id) => {
    return state.attachments.some(attachment => attachment.id === id);
  };

  const value = {
    ...state,
    setAttachments,
    addAttachment,
    updateAttachment,
    removeAttachment,
    reorderAttachments,
    setLoading,
    setError,
    clearError,
    getAttachmentById,
    getAttachmentsCount,
    getTotalSize,
    hasAttachment,
  };

  return (
    <AttachmentsContext.Provider value={value}>
      {children}
    </AttachmentsContext.Provider>
  );
};

// Custom hook to use attachments context
export const useAttachments = () => {
  const context = useContext(AttachmentsContext);
  if (!context) {
    throw new Error('useAttachments must be used within an AttachmentsProvider');
  }
  return context;
};

export default AttachmentsContext;