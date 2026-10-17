/**
 * Short time-based ID so reruns don't clash with other records on the shared demo site
 * @returns last 6 digits of the current timestamp
 */
export const uniqueID = () => Date.now().toString().slice(-6);
