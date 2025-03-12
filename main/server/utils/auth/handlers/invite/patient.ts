import { type SecureSessionData } from "#auth-utils";
import { type DBTransaction } from "~~/server/types/db";

import { type InviteUserRequest } from "~~lib/shared/types/users/invitation/request";



export async function createPatientInvitation(transaction: DBTransaction, patientData: InviteUserRequest, session: SecureSessionData) {
    let clinicianId: string | undefined = undefined;

    if (patientData.mock) {
        if (session.user_role !== 'admin') {
            throw createError({
                statusCode: 403,
                statusMessage: 'You are not authorised to invite users',
            });
        }

        if (patientData.mock.role) {
            if (patientData.mock.role !== 'clinician') {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'Only clinicians can invite patients',
                });
            }
        }

        if (patientData.mock.id) {
            clinicianId = patientData.mock.id;
        }
    }
    else {
        if (session.user_role !== 'clinician') {
            throw createError({
                statusCode: 403,
                statusMessage: 'Only clinicians can invite patients',
            });
        }

        clinicianId = session.user_id;
    }


    const isFullRegistration = !patientData.user.first_name || !patientData.user.last_name;
    const registrationType = isFullRegistration ? 'full' : 'partial';

    // Generate unique invitation token
    const invitationToken = crypto.randomUUID();

    // Set expiration (e.g., 7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    try {
        // Get the role ID for 'patient'
        const roleResult = await transaction.query(`
            SELECT id FROM private.role WHERE name = 'patient' LIMIT 1
        `);

        if (!roleResult.length) {
            throw new Error('Patient role not found');
        }

        const patientRoleId = roleResult[0].id;

        // Create user entry with minimal information if partial registration
        let userId = null;

        if (registrationType === 'partial') {
            // For partial registration, we create the user and patient profile upfront
            const userResult = await transaction.query(`
                INSERT INTO private.user (
                email, first_name, last_name, role_id, status, data_sharing_enabled
                ) VALUES (
                $1, $2, $3, $4, 'pending', $5
                ) RETURNING id
            `, [
                patientData.user.email,
                patientData.user.first_name,
                patientData.user.last_name || null,
                patientRoleId,
                patientData.user.data_sharing_enabled || false
            ]);

            userId = userResult[0].id;

            // Create patient profile
            await transaction.query(`
                INSERT INTO private.patient_profile (
                user_id, private_data
                ) VALUES (
                $1, $2
                )
            `, [
                userId,
                JSON.stringify({}) // Empty private data initially
            ]);
        }

        // Create invitation
        const invitationResult = await transaction.query(`
            INSERT INTO private.user_invitation (
                email, phone_number, user_id, invitation_token, 
                invited_by, role_id, registration_type, expires_at, status
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, 'pending'
            ) RETURNING id
            `, [
            patientData.user.email,
            patientData.user.phone_number || null,
            userId, // Will be null for full registration
            invitationToken,
            clinicianId,
            patientRoleId,
            registrationType,
            expiresAt
        ]);

        const invitationId = invitationResult[0].id;

        // If partial registration, create the clinician-patient relationship immediately
        if (registrationType === 'partial' && userId) {
            await transaction.query(`
                INSERT INTO private.clinician_patient_relationship (
                    clinician_id, patient_id, status
                ) VALUES (
                    $1, $2, 'active'
                )
            `, [
                clinicianId,
                userId
            ]);
        }

        // Commit transaction
        await transaction.commit();

        // Return success result
        return {
            success: true,
            invitationId,
            registrationType,
            invitationToken,
            userId,
            expiresAt
        };

    } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        console.error('Error creating patient invitation:', error);

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create patient invitation',
        });
    }
}