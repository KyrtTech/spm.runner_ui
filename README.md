# SPM UI - Service Package Manager User Interface

This project provides a user-friendly interface for the Service Package Manager (SPM) project. SPM is a powerful tool designed to manage and install fully-fledged services, similar to how npm manages application-level code packages.

## Overview

The SPM UI connects to a running SPM process that exposes a local HTTP server. This server guides the process of service installation, making it easier for users to manage complex service deployments.

## Features

- **Service Installation**: Easily install services through a intuitive user interface.
- **Service Management**: View and manage installed services.
- **Installation Strategies**: Display and select from various installation strategies for each service.
- **Parameter Configuration**: Configure optional and requirement parameters for service installations.
- **Real-time Updates**: Get real-time feedback on the installation process.

## Technology Stack

- React
- TypeScript
- Vite

## Getting Started

1. Ensure you have a running SPM process with its HTTP server exposed.
2. Clone this repository.
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Configuration

The application expects an environment variable `VITE_API_URL` to be set, pointing to the SPM HTTP server. You can set this in a `.env` file in the root of the project:
