-- Migration: Add bloodInventory column to hospitals table
ALTER TABLE hospitals ADD COLUMN bloodInventory TEXT;
