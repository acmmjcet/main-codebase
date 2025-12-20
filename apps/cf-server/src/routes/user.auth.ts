import { Hono } from 'hono';
import {
  createProfile,
  getAllProfiles,
  getProfileByUUID,
  updateProfileByUUID,
} from '../controllers/profiles/auth';

const userProfileRoutes = new Hono();

userProfileRoutes.post('/', createProfile);          // Create profile
userProfileRoutes.get('/', getAllProfiles);          // Get all profiles
userProfileRoutes.get('/:uuid', getProfileByUUID);   // Get single profile
userProfileRoutes.patch('/:uuid', updateProfileByUUID); // Update profile

export default userProfileRoutes;
