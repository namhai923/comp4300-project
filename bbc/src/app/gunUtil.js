import GUN from 'gun';

// Database
export const gun = GUN({ peers: [`${process.env.REACT_APP_BACKEND_URL}/gun`] });

// Gun Utilities
export const addUser = (userName) => {
    const newUser = gun.get(userName);
    gun.get('users').set(newUser);
};

export const peerSendMessage = (sender, receiver, message) => {
    let createdAt = new Date().toISOString();
    let sendMessage = { message, createdAt };

    gun.get('users')
        .get(sender)
        .get(receiver)
        .set({ ...sendMessage, sending: true });
    gun.get('users')
        .get(receiver)
        .get(sender)
        .set({ ...sendMessage, sending: false });
};
