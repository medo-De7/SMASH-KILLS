// ============================================
// HELPER UTILITIES
// ============================================

const Helpers = {
    /**
     * Calculate distance between two 3D points
     */
    calculateDistance(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },

    /**
     * Check if target is in range
     */
    isInRange(pos1, pos2, range) {
        return this.calculateDistance(pos1, pos2) <= range;
    },

    /**
     * Convert degrees to radians
     */
    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    },

    /**
     * Convert radians to degrees
     */
    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    },

    /**
     * Clamp a value between min and max
     */
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Format numbers for UI display
     */
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
};
