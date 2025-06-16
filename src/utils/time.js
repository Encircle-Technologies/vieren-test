const datetime = new Date()

const hour = datetime.getHours()

export function greeting() {
  switch (true) {
    case 5 <= hour && hour < 12:
      return "Morning"
    case 12 <= hour && hour < 17:
      return "Afternoon"
    case (17 <= hour && hour < 24) || (0 <= hour && hour < 5):
      return "Evening"
    default:
      throw new Error(`[Error]Unhandled hour range.`)
  }
}
