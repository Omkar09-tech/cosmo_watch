/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: alerts
 * Interface for Alerts
 */
export interface Alerts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  severity?: string;
  /** @wixFieldType datetime */
  eventTimestamp?: Date | string;
  /** @wixFieldType url */
  asteroidDetailsUrl?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  alertType?: string;
}


/**
 * Collection ID: asteroids
 * Interface for Asteroids
 */
export interface Asteroids {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  designation?: string;
  /** @wixFieldType number */
  absoluteMagnitude?: number;
  /** @wixFieldType number */
  estimatedDiameterMin?: number;
  /** @wixFieldType number */
  estimatedDiameterMax?: number;
  /** @wixFieldType number */
  relativeVelocity?: number;
  /** @wixFieldType number */
  missDistance?: number;
  /** @wixFieldType date */
  closeApproachDate?: Date | string;
  /** @wixFieldType time */
  closeApproachTime?: any;
  /** @wixFieldType text */
  riskLevel?: string;
  /** @wixFieldType boolean */
  isPotentiallyHazardous?: boolean;
}


/**
 * Collection ID: watchlist
 * Interface for Watchlist
 */
export interface Watchlist {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userId?: string;
  /** @wixFieldType text */
  asteroidId?: string;
  /** @wixFieldType text */
  asteroidName?: string;
  /** @wixFieldType datetime */
  addedDate?: Date | string;
  /** @wixFieldType text */
  riskLevel?: string;
  /** @wixFieldType text */
  notes?: string;
}
