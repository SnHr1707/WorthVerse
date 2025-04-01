// --- START OF NEW FILE connectionController.js ---
// connectionController.js
// Backend/controllers/connectionController.js

const Profile = require('../models/Profile');
const User = require('../models/User'); // To verify users exist

// Helper function to check if users exist
const checkUsersExist = async (usernames) => {
    const count = await User.countDocuments({ username: { $in: usernames } });
    return count === usernames.length;
};

// 1. Send Connection Request
exports.sendConnectionRequest = async (req, res) => {
    const senderUsername = req.user.username;
    const receiverUsername = req.params.targetUsername;

    if (senderUsername === receiverUsername) {
        return res.status(400).json({ message: "You cannot send a connection request to yourself." });
    }

    try {
        // Check if both users exist
        if (!await checkUsersExist([senderUsername, receiverUsername])) {
            return res.status(404).json({ message: "One or both users not found." });
        }

        // Get both profiles
        const senderProfile = await Profile.findOne({ username: senderUsername });
        const receiverProfile = await Profile.findOne({ username: receiverUsername });

        if (!senderProfile || !receiverProfile) {
            return res.status(404).json({ message: "One or both profiles not found." });
        }

        // Check if already connected
        if (senderProfile.connections.includes(receiverUsername)) {
            return res.status(400).json({ message: "You are already connected." });
        }

        // Check if request already sent
        if (senderProfile.connectionRequestsSent.includes(receiverUsername)) {
            return res.status(400).json({ message: "Connection request already sent." });
        }

        // Check if request already received from the target user
        if (senderProfile.connectionRequestsReceived.includes(receiverUsername)) {
            return res.status(400).json({ message: `You already have a pending request from ${receiverUsername}. Accept it instead.` });
        }

        // Add request atomically using $addToSet to prevent duplicates
        await Profile.updateOne(
            { username: senderUsername },
            { $addToSet: { connectionRequestsSent: receiverUsername } }
        );
        await Profile.updateOne(
            { username: receiverUsername },
            { $addToSet: { connectionRequestsReceived: senderUsername } }
        );

        console.log(`Connection request sent from ${senderUsername} to ${receiverUsername}`);
        res.status(200).json({ message: "Connection request sent successfully." });

    } catch (error) {
        console.error(`Error sending connection request from ${senderUsername} to ${receiverUsername}:`, error);
        res.status(500).json({ message: "Server error while sending request.", error: error.message });
    }
};

// 2. Accept Connection Request
exports.acceptConnectionRequest = async (req, res) => {
    const acceptorUsername = req.user.username; // The user accepting the request
    const requesterUsername = req.params.requesterUsername; // The user who sent the request

    if (acceptorUsername === requesterUsername) {
        return res.status(400).json({ message: "Invalid operation." });
    }

    try {
        // Check if both users exist
        if (!await checkUsersExist([acceptorUsername, requesterUsername])) {
            return res.status(404).json({ message: "One or both users not found." });
        }

        // Check if the request actually exists
        const acceptorProfile = await Profile.findOne({ username: acceptorUsername }).select('connectionRequestsReceived connections');
        const requesterProfile = await Profile.findOne({ username: requesterUsername }).select('connectionRequestsSent connections');

        if (!acceptorProfile || !requesterProfile) {
            return res.status(404).json({ message: "One or both profiles not found." });
        }

        if (!acceptorProfile.connectionRequestsReceived.includes(requesterUsername)) {
            return res.status(400).json({ message: "No pending connection request found from this user." });
        }

        // --- Perform the connection update ---
        // Use $pull to remove from request arrays and $addToSet to add to connections arrays atomically
        // For the acceptor:
        await Profile.updateOne(
            { username: acceptorUsername },
            {
                $pull: { connectionRequestsReceived: requesterUsername },
                $addToSet: { connections: requesterUsername }
            }
        );
        // For the requester:
        await Profile.updateOne(
            { username: requesterUsername },
            {
                $pull: { connectionRequestsSent: acceptorUsername },
                $addToSet: { connections: acceptorUsername }
            }
        );

        console.log(`Connection request from ${requesterUsername} accepted by ${acceptorUsername}`);
        res.status(200).json({ message: `Connection with ${requesterUsername} established.` });

    } catch (error) {
        console.error(`Error accepting connection request from ${requesterUsername} by ${acceptorUsername}:`, error);
        res.status(500).json({ message: "Server error while accepting request.", error: error.message });
    }
};

// 3. Reject Connection Request
exports.rejectConnectionRequest = async (req, res) => {
    const rejectorUsername = req.user.username; // User rejecting
    const requesterUsername = req.params.requesterUsername; // User whose request is rejected

     if (rejectorUsername === requesterUsername) {
        return res.status(400).json({ message: "Invalid operation." });
    }

    try {
        // Check if users exist (optional, but good practice)
        if (!await checkUsersExist([rejectorUsername, requesterUsername])) {
            return res.status(404).json({ message: "One or both users not found." });
        }

        // Check if the request actually exists before trying to remove it
        const rejectorProfile = await Profile.findOne({ username: rejectorUsername }).select('connectionRequestsReceived');
         if (!rejectorProfile || !rejectorProfile.connectionRequestsReceived.includes(requesterUsername)) {
            return res.status(400).json({ message: "No pending connection request found from this user to reject." });
        }

        // Remove the request using $pull
        // For the rejector:
        await Profile.updateOne(
            { username: rejectorUsername },
            { $pull: { connectionRequestsReceived: requesterUsername } }
        );
        // For the requester:
        await Profile.updateOne(
            { username: requesterUsername },
            { $pull: { connectionRequestsSent: rejectorUsername } }
        );

        console.log(`Connection request from ${requesterUsername} rejected by ${rejectorUsername}`);
        res.status(200).json({ message: "Connection request rejected." });

    } catch (error) {
        console.error(`Error rejecting connection request from ${requesterUsername} by ${rejectorUsername}:`, error);
        res.status(500).json({ message: "Server error while rejecting request.", error: error.message });
    }
};

// 4. Withdraw Connection Request
exports.withdrawConnectionRequest = async (req, res) => {
    const withdrawerUsername = req.user.username; // User withdrawing their sent request
    const targetUsername = req.params.targetUsername; // User to whom the request was sent

    if (withdrawerUsername === targetUsername) {
        return res.status(400).json({ message: "Invalid operation." });
    }

    try {
        // Check if users exist
        if (!await checkUsersExist([withdrawerUsername, targetUsername])) {
            return res.status(404).json({ message: "One or both users not found." });
        }

        // Check if the request was actually sent
         const withdrawerProfile = await Profile.findOne({ username: withdrawerUsername }).select('connectionRequestsSent');
         if (!withdrawerProfile || !withdrawerProfile.connectionRequestsSent.includes(targetUsername)) {
            return res.status(400).json({ message: "No pending connection request found to withdraw for this user." });
        }

        // Remove the request using $pull
        // For the withdrawer:
        await Profile.updateOne(
            { username: withdrawerUsername },
            { $pull: { connectionRequestsSent: targetUsername } }
        );
        // For the target user:
        await Profile.updateOne(
            { username: targetUsername },
            { $pull: { connectionRequestsReceived: withdrawerUsername } }
        );

        console.log(`Connection request from ${withdrawerUsername} to ${targetUsername} withdrawn`);
        res.status(200).json({ message: "Connection request withdrawn." });

    } catch (error) {
        console.error(`Error withdrawing connection request from ${withdrawerUsername} to ${targetUsername}:`, error);
        res.status(500).json({ message: "Server error while withdrawing request.", error: error.message });
    }
};

// 5. Remove Connection (Disconnect)
exports.removeConnection = async (req, res) => {
    const removerUsername = req.user.username; // User initiating the removal
    const connectionUsername = req.params.connectionUsername; // User being disconnected

    if (removerUsername === connectionUsername) {
        return res.status(400).json({ message: "You cannot remove yourself as a connection." });
    }

    try {
        // Check if users exist
        if (!await checkUsersExist([removerUsername, connectionUsername])) {
            return res.status(404).json({ message: "One or both users not found." });
        }

         // Check if they are actually connected
        const removerProfile = await Profile.findOne({ username: removerUsername }).select('connections');
         if (!removerProfile || !removerProfile.connections.includes(connectionUsername)) {
            return res.status(400).json({ message: `You are not connected with ${connectionUsername}.` });
        }

        // Remove the connection using $pull from both users' connection arrays
        // For the remover:
        await Profile.updateOne(
            { username: removerUsername },
            { $pull: { connections: connectionUsername } }
        );
        // For the user being removed:
        await Profile.updateOne(
            { username: connectionUsername },
            { $pull: { connections: removerUsername } }
        );

        console.log(`Connection between ${removerUsername} and ${connectionUsername} removed`);
        res.status(200).json({ message: `You are no longer connected with ${connectionUsername}.` });

    } catch (error) {
        console.error(`Error removing connection between ${removerUsername} and ${connectionUsername}:`, error);
        res.status(500).json({ message: "Server error while removing connection.", error: error.message });
    }
};