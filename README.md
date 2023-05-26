# TravelersTea

## Table of Contents

- [Project Description](#project-description)
- [Team Members](#team-members)
- [Project Requirements](#project-requirements)
  - [Minimal Requirements](#minimal-requirements)
  - [Standard Requirements](#standard-requirements)
  - [Stretch Requirements](#stretch-requirements)
- [Task Breakdown](#task-breakdown)
- [Prototypes](#prototypes)

## Project Description

This project is for users who would like to create plans in some location X, and the app will serve as a personal assistant. Our app will suggest an itinerary based on the user's preferences to make planning a trip less daunting and less time consuming. We will store information related to travel plans. A plan will consist of destinations (e.g. a movie theater, a cute park), and information regarding that destination (e.g. description, name, price, location etc). Given this data, users will be able to have meaningful thought out trips. Additional functionalities include a social aspect (e.g. sharing plans, rating plans).

## Team Members

- Lymeng Naret
- Noreen Chan
- Rithin Kumar
- Vaishnavi Sinha
- Andy Liang

## Project Requirements

#### Minimal Requirements

- Users should be able to input a set of preferences (Destination, Number of Days, Budget, Places per day), to generate personalized travel plans.
- Users can see destination markers on a map.
- Users can see a description of each destination.
- Users can create, read, update, and delete plan metadata.
- Users can manually update an individual destination within a plan.

#### Standard Requirements

- Display ratings of suggested places.
- Currency conversion for non-local plans.
- Users can regenerate specific locations of a plan’s destinations.
- Login system.
- Notes section (e.g. dietary restrictions, travel preferences).

#### Stretch Requirements

- Colloquial prompts (e.g. instead of “{ destination: ‘Vancouver’, budget: 300 }”, just input “I want to tour Vancouver and spend $300 max.”)
- Users can generate different plans based on the weather.
- Multi-language support.
- Entire application should be mobile-friendly
- Users can share plans on a global list.
- Users can vote on plans.
- Share itinerary as a link.
- DallE to generate Pin icons.

## Task Breakdown

#### Users should be able to input a set of preferences (Destination, Number of Days, Budget, Places per day), to generate personalized travel plans.

- Users will enter the following preferences for example in the form:
  - Number of days
  - Number of places per day
  - Budget
  - Destination city
- App will provide Expected Outputs:
  - Stage
  - Name of Place
  - Description
  - Location
  - Expense
- Design the frontend
  - Mockup for input form
  - Mockups for output of stages
- Design the backend routes

#### Users can create, read, update, and delete plan metadata

- Create: this creates the plan, along with the metadata fields `Name` and `Description`.
- Read: display the metadata in an UI
- Update: can update the plan’s metadata or destinations
- Delete: this deletes the entire plan

## Prototypes

#### Top-level plan: Homepage

User input

![User Input](mocks/mock-a.png)

### App Response: Plan Overview

With sidebar closed

![Plan Overview - Closed Sidebar](mocks/mock-b.png)

With sidebar open: Specific details about a day in the plan

![Plan Overview - Open Sidebar](mocks/mock-c.png)
