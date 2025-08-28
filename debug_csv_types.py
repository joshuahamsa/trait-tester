#!/usr/bin/env python3

import csv

def debug_csv_types():
    csv_data = []
    with open('Baysed Traits Named.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            csv_data.append(row)
    
    trait_types = set()
    for row in csv_data:
        trait_types.add(row['Trait_Type'])
    
    print("CSV trait types:", sorted(trait_types))

if __name__ == "__main__":
    debug_csv_types()
