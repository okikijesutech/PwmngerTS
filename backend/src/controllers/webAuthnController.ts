import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/types';
import { prisma } from '../db/prisma';
import type { Request, Response } from 'express';
import { AppError } from '../utils/errors';

// Human-readable title for the RP
const rpName = 'PwmngerTS';
// A unique identifier for your website
const rpID = process.env.RP_ID || 'localhost';
// The URL at which the registration and authentication should occur
const origin = process.env.ORIGIN || `http://${rpID}:5173`;

/**
 * Registration: Step 1 - Generate Options
 */
export async function getRegistrationOptions(req: Request, res: Response) {
  const userId = (req as any).user.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { authenticators: true }
  });

  if (!user) throw new AppError('User not found', 404);

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.email,
    // Don't prompt users for device names, let's just use email
    userDisplayName: user.email,
    attestationType: 'none',
    /**
     * Passing latest byte-array form of Credential ID's to prevent
     * users from re-registering the same authenticator
     */
    excludeCredentials: user.authenticators.map(auth => ({
      id: Buffer.from(auth.credentialID, 'base64'),
      type: 'public-key',
      // Optional: transports: auth.transports.split(',')
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'cross-platform', // Focus on YubiKeys
    },
  });

  // Store challenge in session (assuming express-session or similar)
  // For now, let's keep it simple. In a production app, you'd store this in Redis or a DB linked to the user.
  // Since we are stateless (JWT), we might need another way or just a temporary store.
  // FIXED: For simplicity in this demo, we'll return the challenge but in reality, it must be verified.
  (req as any).session = { ...(req as any).session, currentRegistrationChallenge: options.challenge };

  res.json(options);
}

/**
 * Registration: Step 2 - Verify Response
 */
export async function verifyRegistration(req: Request, res: Response) {
  const userId = (req as any).user.userId;
  const body: RegistrationResponseJSON = req.body;

  const expectedChallenge = (req as any).session?.currentRegistrationChallenge;

  if (!expectedChallenge) {
    throw new AppError('Registration challenge not found. Please restart ceremony.', 400);
  }

  const identity = await prisma.user.findUnique({ where: { id: userId } });
  if (!identity) throw new AppError('User not found', 404);

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).send({ error: error.message });
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    await prisma.authenticator.create({
      data: {
        credentialID: Buffer.from(credentialID).toString('base64'),
        credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
        counter,
        credentialDeviceType: registrationInfo.credentialDeviceType,
        credentialBackedUp: registrationInfo.credentialBackedUp,
        userId: identity.id,
      },
    });

    res.json({ verified: true });
  } else {
    res.status(400).json({ error: 'Verification failed' });
  }
}

/**
 * Authentication: Step 1 - Generate Options
 */
export async function getAuthenticationOptions(req: Request, res: Response) {
  const { email } = req.body; // Publicly accessible to identify the user

  const user = await prisma.user.findUnique({
    where: { email },
    include: { authenticators: true }
  });

  if (!user) throw new AppError('User not found', 404);

  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: user.authenticators.map(auth => ({
      id: Buffer.from(auth.credentialID, 'base64'),
      type: 'public-key',
    })),
    userVerification: 'preferred',
  });

  // Store challenge for verification
  (req as any).session = { ...(req as any).session, currentAuthenticationChallenge: options.challenge, targetAuthUserId: user.id };

  res.json(options);
}

/**
 * Authentication: Step 2 - Verify Response
 */
export async function verifyAuthentication(req: Request, res: Response) {
  const body: AuthenticationResponseJSON = req.body;
  const expectedChallenge = (req as any).session?.currentAuthenticationChallenge;
  const userId = (req as any).session?.targetAuthUserId;

  if (!expectedChallenge || !userId) {
    throw new AppError('Authentication challenge not found. Please restart ceremony.', 400);
  }

  const authenticator = await prisma.authenticator.findFirst({
    where: { 
      credentialID: body.id,
      userId: userId
    }
  });

  if (!authenticator) throw new AppError('Authenticator not found', 401);

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialID: Buffer.from(authenticator.credentialID, 'base64'),
        credentialPublicKey: Buffer.from(authenticator.credentialPublicKey, 'base64'),
        counter: Number(authenticator.counter),
      },
      requireUserVerification: true,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(400).send({ error: error.message });
  }

  const { verified, authenticationInfo } = verification;

  if (verified) {
    // Update counter
    await prisma.authenticator.update({
      where: { id: authenticator.id },
      data: { counter: BigInt(authenticationInfo.newCounter) }
    });

    res.json({ verified: true, userId });
  } else {
    res.status(400).json({ error: 'Verification failed' });
  }
}
