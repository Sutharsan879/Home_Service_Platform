import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database, storage } from '../firebase'; 
import { ref, get, update } from 'firebase/database'; 
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import './ProfileDropdown.css';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); 
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, 'users/' + user.uid);
        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              setUserData(snapshot.val());
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      } else {
        setUserData(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleImageUpload = async () => {
    if (selectedImage) {
      const user = auth.currentUser;
      if (!user) {
        console.error("No user is signed in!");
        return;
      }
      const storageReference = storageRef(storage, `profileImages/${user.uid}`); 
      await uploadBytes(storageReference, selectedImage); 
      const downloadURL = await getDownloadURL(storageReference); 
      const userRef = ref(database, 'users/' + user.uid);
      await update(userRef, { profileImage: downloadURL });
      setUserData((prevData) => ({
        ...prevData,
        profileImage: downloadURL
      }));

      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  return (
    <div className="profile-dropdown">
      <button className="profile-button" onClick={toggleDropdown}>
        {userData ? userData.firstName : "Profile"}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={() => setShowProfile(true)}>View Profile</button>
          <button className='bt3' onClick={handleLogout}>Logout</button>
        </div>
      )}

      {showProfile && (
        <div className="profile-modal">
          <div className="modal-content">
            {userData ? (
              <>
                <img
                  src={userData.profileImage || "https://via.placeholder.com/100"} 
                  alt="Profile"
                  className="profile-img"
                />
                <h3>{userData.firstName} {userData.lastName}</h3>
                <p>Email: {userData.email}</p>
                <p>Role: {userData.role}</p>

                <label htmlFor="profileImage">Change Profile Image:</label>
                <input type="file" id="profileImage" onChange={handleImageChange} />
                
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" className="preview-img" />
                  </div>
                )}
                
                <div className='some'>
                <button className="btn1" onClick={handleImageUpload}>Upload Image</button>
                <button className="btn2" onClick={() => setShowProfile(false)}>Close</button>
                </div>
              </>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
