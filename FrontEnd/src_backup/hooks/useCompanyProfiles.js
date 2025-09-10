import { useState, useCallback } from "react";
import CompanyProfileService from "../services/companyProfileService";

export const useCompanyProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load the last updated profile
  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await CompanyProfileService.getLastProfile();
      if (result.success && result.data) {
        setProfiles([result.data]); // Wrap single profile in array for compatibility
      } else {
        setProfiles([]); // No profile found
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to load last profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new profile
  const createProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CompanyProfileService.createProfile(profileData);
      if (result.success) {
        setProfiles((prev) => [result.data, ...prev]);
        return result.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a profile
  const updateProfile = useCallback(async (id, profileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CompanyProfileService.updateProfile(id, profileData);
      if (result.success) {
        setProfiles((prev) =>
          prev.map((profile) => (profile.id === id ? result.data : profile))
        );
        return result.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a profile
  const deleteProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await CompanyProfileService.deleteProfile(id);
      setProfiles((prev) => prev.filter((profile) => profile.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get a single profile
  const getProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CompanyProfileService.getProfile(id);
      if (result.success) {
        return result.data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload image
  const uploadImage = useCallback(async (file, type = "logo") => {
    setLoading(true);
    setError(null);
    try {
      const result = await CompanyProfileService.uploadImage(file, type);
      if (result.success) {
        return result;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    profiles,
    loading,
    error,
    loadProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
    getProfile,
    uploadImage,
    clearError,
  };
};

export default useCompanyProfiles;
