# Andrea's Reward Chart

A simple, child-friendly web application for tracking daily tasks and earning rewards. This application is designed to help children visualize their progress and stay motivated to complete their daily tasks.

## Features

- Track daily tasks completion
- Visual reward chart with checkmarks
- Point system for completed tasks
- Reward levels that unlock as points accumulate
- Data is saved locally in the browser (no login required)
- Mobile-friendly design

## How to Use

1. **For Parents:**
   - Set up the application on a device your child can access
   - Explain the tasks and rewards to your child
   - Help them mark tasks as completed initially
   - Use the "Reset Chart" button at the end of each week or when starting a new reward period

2. **For Children:**
   - Click on the circle in the chart to mark a task as completed
   - Watch your points increase as you complete tasks
   - See which rewards you've unlocked based on your points

## Tasks Included

- Total Goal
- Finish Homework (reading and writing)
- Toilet 4 Times
- Talk, No Only Cry
- TV Less Than 30 Mins
- Running
- Other Sports 🏀
- Eat Vege 🥦
- Go To Bed At 8PM

## Rewards

- 7 Points: ⭐ Extra Bedtime or TV time (20 minutes)
- 25 Points: 🎮 Robox Time and Ice cream
- 40 Points: 🎁 Pick Up Your Gift (A toy) or treat under $20
- 45 Points: 🎁 Pick Up Your Gift (A toy) or treat under $20

## Development

This application is built with:
- Next.js
- React
- TypeScript
- TailwindCSS

### Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Customization

You can customize the tasks and rewards by editing the `TASKS` and `REWARD_POINTS` arrays in the `src/app/page.tsx` file.

## License

This project is open source and available for personal use.
