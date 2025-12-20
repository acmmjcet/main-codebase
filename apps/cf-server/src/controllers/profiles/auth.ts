import { Context } from 'hono';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { users } from '../../db/schema';

/* ================================
   GET ALL PROFILES
================================ */
export const getAllProfiles = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);

    const profiles = await db.select().from(users).all();

    return c.json({
      success: true,
      message: 'Profiles fetched successfully!',
      total: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return c.json(
      { success: false, message: 'Internal server error.' },
      500
    );
  }
};

/* ================================
   CREATE PROFILE
================================ */
export const createProfile = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const body = await c.req.json();

    const {
      uuid,
      full_name,
      email,
      acm_member_id,
      member_type,
      role_type,
    } = body;

    // Basic validation
    if (!uuid || !full_name || !email) {
      return c.json(
        { success: false, message: 'uuid, full_name and email are required.' },
        400
      );
    }

    // Restrict to college email
    const emailRegex = /^[^\s@]+@mjcollege\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return c.json(
        { success: false, message: 'Only @mjcollege.ac.in emails are allowed.' },
        400
      );
    }

    const result = await db
      .insert(users)
      .values({
        uuid,
        full_name,
        email: email.toLowerCase(),
        acm_member_id,
        member_type, // optional (default = "core")
        role_type,
      })
      .returning();

    return c.json({
      success: true,
      message: 'Profile created successfully!',
      data: result[0],
    });
  } catch (error) {
    console.error('Profile creation error:', error);
    return c.json(
      { success: false, message: 'Internal server error.' },
      500
    );
  }
};

/* ================================
   GET PROFILE BY UUID
================================ */
export const getProfileByUUID = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const uuid = c.req.param('uuid');

    if (!uuid) {
      return c.json({ success: false, message: 'UUID is required.' }, 400);
    }

    const profile = await db
      .select()
      .from(users)
      .where(eq(users.uuid, uuid))
      .limit(1);

    if (profile.length === 0) {
      return c.json({ success: false, message: 'Profile not found.' }, 404);
    }

    return c.json({
      success: true,
      message: 'Profile fetched successfully!',
      data: profile[0],
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json(
      { success: false, message: 'Internal server error.' },
      500
    );
  }
};

/* ================================
   UPDATE PROFILE BY UUID
================================ */
export const updateProfileByUUID = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const uuid = c.req.param('uuid');
    const body = await c.req.json();

    if (!uuid) {
      return c.json({ success: false, message: 'UUID is required.' }, 400);
    }

    // Allowed fields based on schema
    const allowedFields = [
      'full_name',
      'email',
      'is_active',
      'last_login',
      'acm_member_id',
      'member_type',
      'role_type',
    ];

    const updateData: any = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    if (body.email) {
      const emailRegex = /^[^\s@]+@mj\.college\.ac\.in$/;
      if (!emailRegex.test(body.email)) {
        return c.json(
          { success: false, message: 'Only @mj.college.ac.in emails are allowed.' },
          400
        );
      }
      updateData.email = body.email.toLowerCase();
    }

    updateData.updated_at = new Date().toISOString();

    if (Object.keys(updateData).length === 0) {
      return c.json(
        { success: false, message: 'No valid fields to update.' },
        400
      );
    }

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.uuid, uuid))
      .run() as any;

    if (result.rowsAffected === 0) {
      return c.json(
        { success: false, message: 'Profile not found.' },
        404
      );
    }

    return c.json({
      success: true,
      message: 'Profile updated successfully.',
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return c.json(
      { success: false, message: 'Internal server error.' },
      500
    );
  }
};
