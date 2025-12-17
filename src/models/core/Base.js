/**
 * Base class for auditable objects
 */
class Base {
  /**
   * Create a new Base instance
   * @param {Date} createdDate - The created date
   * @param {Date} modifiedDate - The modified date
   */
  constructor(createdDate, modifiedDate) {
    this.createdDate = createdDate;
    this.modifiedDate = modifiedDate;
  }
}

export { Base };