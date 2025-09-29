/**
 * Settings class for user settings and preferences
 */
class Settings extends Base {
  constructor(data = {}) {
    const now = new Date().toISOString();
    super(data.createdDate || now, data.modifiedDate || now);
    this.defaultProjectsPath = data.defaultProjectsPath || "C:\\Users\\BradleyDeans\\Dev";
  }

  /**
   * Update the modified date timestamp
   */
  touch() {
    this.modifiedDate = new Date().toISOString();
  }
};

export { Settings };