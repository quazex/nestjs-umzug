/**
 * @private
 */
export interface StorageDocument {
    id: string;
    name: string;
    timestamp: Date;
}

/**
 * @private
 */
export interface StorageParams {
    name: string;
    path?: string;
}
