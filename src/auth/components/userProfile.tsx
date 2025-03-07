import React from 'react';

interface UserProfileProps {
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ nom, prenom, email }) => {
  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">User Profile</h5>
          <p className="card-text"><strong>Nom:</strong> {nom}</p>
          <p className="card-text"><strong>Prénom:</strong> {prenom}</p>
          <p className="card-text"><strong>Email:</strong> {email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
