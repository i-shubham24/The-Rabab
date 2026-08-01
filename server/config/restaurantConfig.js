// Restaurant Configuration — Slot-based reservation system
const restaurantConfig = {
  name: 'Majestic Rabab',
  
  // Operating hours
  openTime: '12:00',
  closeTime: '22:30',
  
  // Slot settings
  slotDurationMinutes: 30,      // Each reservation slot is 30 minutes
  maxCoversPerSlot: 40,          // Max guests across all tables per slot
  
  // Table configuration
  tables: [
    { id: 1, name: 'Table 1', seats: 2, zone: 'Indoor' },
    { id: 2, name: 'Table 2', seats: 2, zone: 'Indoor' },
    { id: 3, name: 'Table 3', seats: 4, zone: 'Indoor' },
    { id: 4, name: 'Table 4', seats: 4, zone: 'Indoor' },
    { id: 5, name: 'Table 5', seats: 6, zone: 'Indoor' },
    { id: 6, name: 'Table 6', seats: 6, zone: 'Indoor' },
    { id: 7, name: 'Table 7', seats: 8, zone: 'Private Dining' },
    { id: 8, name: 'Table 8', seats: 4, zone: 'Outdoor' },
    { id: 9, name: 'Table 9', seats: 4, zone: 'Outdoor' },
    { id: 10, name: 'Table 10', seats: 2, zone: 'Outdoor' },
  ],

  // Generate all time slots for a day
  getTimeSlots() {
    const slots = [];
    const [openH, openM] = this.openTime.split(':').map(Number);
    const [closeH, closeM] = this.closeTime.split(':').map(Number);
    
    let currentMinutes = openH * 60 + openM;
    const endMinutes = closeH * 60 + closeM;
    
    while (currentMinutes < endMinutes) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      currentMinutes += this.slotDurationMinutes;
    }
    
    return slots;
  },

  // Get total restaurant capacity
  getTotalCapacity() {
    return this.tables.reduce((sum, t) => sum + t.seats, 0);
  }
};

export default restaurantConfig;
