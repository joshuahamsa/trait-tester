# Trait Matching Analysis

This document analyzes the matching between traits in `script.js` and the CSV file across different categories.

## Summary

| Metric | Count |
|--------|-------|
| Total Script.js traits | 327 |
| Total CSV traits | 302 |
| ✅ Found matches | 250 |
| ❌ Missing in script.js | 52 |
| ❌ Unassociated traits | 21 |

### All Missing in Script.js (Need Artist Tickets)

| Collection | Trait Type | Original Trait | Updated Trait |
|------------|------------|----------------|---------------|
| HOG | Skin | Normal | HOG Normal |
| HOG | Skin | Black | HOG Fire from Apes |
| HOG | Skin | Diamond | HOG Abyssal Diamondglow |
| HOG | Skin | Cow | HOG Duskfang Bovine Hide |
| HOG | Skin | Blue | HOG Obsidian Azure Spikes |
| APE | Mouth | Bubble | APE Thorn-Infused Jungle Gum |
| APE | Mouth | Donut | APE Ravaged Donut |
| APE | Mouth | Hotdog | APE Inferno Hotdog |
| APE | Mouth | Rainbow | APE Rainbow Spheres |
| HOG | Mouth | Closed | HOG Closed H |
| HOG | Mouth | Pizza | HOG Infernapep Slice |
| HOG | Mouth | Angry | HOG Angry H |
| HOG | Mouth | Dynamite | HOG Blazestick |
| HOG | Mouth | Sad | HOG Sad H |
| HOG | Mouth | Grin | HOG Grin H |
| HOG | Mouth | Dagger | HOG Emberfang Dagger |
| HOG | Mouth | Big Cigarette | HOG Smofang Emberroll |
| HOG | Mouth | Cigar | HOG Blightwrap Cinderroll |
| HOG | Mouth | Lolly | HOG Venomlick Shardpop |
| HOG | Mouth | Banana | HOG Feralbane Husk |
| HOG | Mouth | Rainbow Teeth | HOG Prismfang Grille |
| HOG | Mouth | Gold Teeth | HOG Molten Maw |
| HOG | Mouth | Gold Pipe | HOG Sunfang Pipe |
| HOG | Mouth | Diamond Pipe | HOG Shardsmoke Scepter |
| HOG | Mouth | Rainbow Doodle | HOG Oblivion Rainbow |
| HOG | Mouth | Cigarette | HOG Ashvein Stick |
| HOG | Mouth | Diamond Teeth | HOG Shatterbite Grille |
| APE | Eyes | Cyborg | APE Dominition Warfare |
| APE | Eyes | Shutter | APE Crimson Razor Shutters |
| HOG | Eyes | Blue eye | HOG Blue eye |
| HOG | Eyes | Happy | HOG Happy H |
| HOG | Eyes | Egg | HOG Mutated Omelette |
| HOG | Eyes | Pierceing | HOG Piercing |
| HOG | Eyes | Highwayman Mask | HOG Veil of Ashrift |
| HOG | Eyes | Red laser | HOG Red laser H |
| APE | Headwear | Blank | APE Blank |
| HOG | Headwear | Backwards Cap | HOG Backwards Bloodshade Raider Cap |
| HOG | Headwear | Chinese Hat | HOG Obsidian Fang War Hat |
| HOG | Headwear | McHog | HOG Zombie |
| HOG | Headwear | Helmet | HOG Ironwind Aviator Cap |
| HOG | Headwear | Beret | HOG Shadowspire Beret |
| HOG | Clothing | Futuristic | HOG Obsidiansteel Shadowplate |
| HOG | Clothing | Mud spots | HOG Eldritch Slime Patches |
| HOG | Clothing | Mc Polo | HOG Shadowgrill Uniform |
| HOG | Clothing | Training Suit | HOG Training |
| HOG | Clothing | Suspender | HOG Sleek Suspenders |
| HOG | Clothing | Samurai 2 | HOG Obsidian Ronin Armor |
| HOG | Clothing | Nirvana | HOG Nirvana Embrace |
| HOG | Clothing | Samurai | HOG Shadow Ronin Vanguard |
| HOG | Clothing | Army General | HOG Shadow Legion Command Regalia |
| HOG | Tusk | Normal | HOG Normal H |
| HOG | Tusk | Silver Tusk | HOG Silver Tusks |

### All Unassociated Traits (Need CSV Entries)

| Collection | Trait Type | Original Trait | Updated Trait |
|------------|------------|----------------|---------------|
| HOG | Unknown | Azure Spikes | HOG Azure Spikes |
| HOG | Unknown | TBD | HOG TBD |
| APE | Unknown | Inferno Hot Dog | APE Inferno Hot Dog |
| APE | Unknown | Prism Jaw | APE Prism Jaw |
| HOG | Unknown | angry | HOG angry |
| HOG | Unknown | Close | HOG Close |
| HOG | Unknown | Grin | HOG Grin |
| HOG | Unknown | Rainbow Puke | HOG Rainbow Puke |
| APE | Unknown | Eyes | APE Eyes |
| APE | Unknown | Shutter | APE Shutter |
| HOG | Unknown | Blue Eye | HOG Blue Eye |
| HOG | Unknown | Gold Laser | HOG Gold Laser |
| HOG | Unknown | Green Laser | HOG Green Laser |
| HOG | Unknown | Red Laser H | HOG Red Laser H |
| HOG | Unknown | Aviation Cap | HOG Aviation Cap |
| HOG | Unknown | Backwards Cap | HOG Backwards Cap |
| HOG | Unknown | Chinese Hat | HOG Chinese Hat |
| HOG | Unknown | Irongrill Hat | HOG Irongrill Hat |
| HOG | Unknown | Phantom Marauder Mask | HOG Phantom Marauder Mask |
| HOG | Unknown | Piercing | HOG Piercing |
| HOG | Unknown | Moonshard Tusks | HOG Moonshard Tusks |

---

## SKIN

| Metric | Count |
|--------|-------|
| Script.js traits | 42 |
| CSV traits | 45 |
| ✅ Matches | 40 |
| ❌ Missing in script.js | 5 |
| ❌ Unassociated traits | 2 |

### Missing in script.js

- Normal → Normal (HOG Normal)
- Black → Fire from Apes (HOG Fire from Apes)
- Diamond → Abyssal Diamondglow (HOG Abyssal Diamondglow)
- Cow → Duskfang Bovine Hide (HOG Duskfang Bovine Hide)
- Blue → Obsidian Azure Spikes (HOG Obsidian Azure Spikes)

### Unassociated Traits

- HOG Azure Spikes
- HOG TBD

### Sample Matches

1. Cheetah → APE Cosmic Cheetah Fur
2. Magnolia → APE Royal Blossom
3. White → APE Lunar Crystaline
4. Brown → APE Default
5. Rainbow → APE Chromatic Armor

---

## CLOTHES

❌ Trait type 'Clothes' -> 'Clothing' not found in script.js

## MOUTH

| Metric | Count |
|--------|-------|
| Script.js traits | 42 |
| CSV traits | 57 |
| ✅ Matches | 35 |
| ❌ Missing in script.js | 22 |
| ❌ Unassociated traits | 6 |

### Missing in script.js

- Bubble → Thorn-Infused Jungle Gum (APE Thorn-Infused Jungle Gum)
- Donut → Ravaged Donut (APE Ravaged Donut)
- Hotdog → Inferno Hotdog (APE Inferno Hotdog)
- Rainbow → Rainbow Spheres (APE Rainbow Spheres)
- Closed → Closed H (HOG Closed H)
- Pizza → Infernapep Slice (HOG Infernapep Slice)
- Angry → Angry H (HOG Angry H)
- Dynamite → Blazestick (HOG Blazestick)
- Sad → Sad H (HOG Sad H)
- Grin → Grin H (HOG Grin H)
- Dagger → Emberfang Dagger (HOG Emberfang Dagger)
- Big Cigarette → Smofang Emberroll (HOG Smofang Emberroll)
- Cigar → Blightwrap Cinderroll (HOG Blightwrap Cinderroll)
- Lolly → Venomlick Shardpop (HOG Venomlick Shardpop)
- Banana → Feralbane Husk (HOG Feralbane Husk)
- Rainbow Teeth → Prismfang Grille (HOG Prismfang Grille)
- Gold Teeth → Molten Maw (HOG Molten Maw)
- Gold Pipe → Sunfang Pipe (HOG Sunfang Pipe)
- Diamond Pipe → Shardsmoke Scepter (HOG Shardsmoke Scepter)
- Rainbow Doodle → Oblivion Rainbow (HOG Oblivion Rainbow)
- Cigarette → Ashvein Stick (HOG Ashvein Stick)
- Diamond Teeth → Shatterbite Grille (HOG Shatterbite Grille)

### Unassociated Traits

- APE Inferno Hot Dog
- APE Prism Jaw
- HOG angry
- HOG Close
- HOG Grin
- HOG Rainbow Puke

### Sample Matches

1. Angry → APE Angry
2. Bite Lips → APE Bite Lips
3. Bite Teeth → APE Bite Teeth
4. Cigar → APE Cyber Furnace-Cigar
5. Cigarette → APE Nuclear Stogie

---

## EYES

| Metric | Count |
|--------|-------|
| Script.js traits | 57 |
| CSV traits | 59 |
| ✅ Matches | 51 |
| ❌ Missing in script.js | 8 |
| ❌ Unassociated traits | 6 |

### Missing in script.js

- Cyborg → Dominition Warfare (APE Dominition Warfare)
- Shutter → Crimson Razor Shutters (APE Crimson Razor Shutters)
- Blue eye → Blue eye (HOG Blue eye)
- Happy → Happy H (HOG Happy H)
- Egg → Mutated Omelette (HOG Mutated Omelette)
- Pierceing → Piercing (HOG Piercing)
- Highwayman Mask → Veil of Ashrift (HOG Veil of Ashrift)
- Red laser → Red laser H (HOG Red laser H)

### Unassociated Traits

- APE Eyes
- APE Shutter
- HOG Blue Eye
- HOG Gold Laser
- HOG Green Laser
- HOG Red Laser H

### Sample Matches

1. 3D → APE Dimensional Spectra Frames
2. 70s → APE Retro Neon Eclipse
3. Angry → APE Angry
4. Arrogant → APE Arrogant
5. Blindfold → APE Mystic Veil Vision

---

## HEADWEAR

| Metric | Count |
|--------|-------|
| Script.js traits | 78 |
| CSV traits | 78 |
| ✅ Matches | 72 |
| ❌ Missing in script.js | 6 |
| ❌ Unassociated traits | 6 |

### Missing in script.js

- Blank → Blank (APE Blank)
- Backwards Cap → Backwards Bloodshade Raider Cap (HOG Backwards Bloodshade Raider Cap)
- Chinese Hat → Obsidian Fang War Hat (HOG Obsidian Fang War Hat)
- McHog → Zombie (HOG Zombie)
- Helmet → Ironwind Aviator Cap (HOG Ironwind Aviator Cap)
- Beret → Shadowspire Beret (HOG Shadowspire Beret)

### Unassociated Traits

- HOG Aviation Cap
- HOG Backwards Cap
- HOG Chinese Hat
- HOG Irongrill Hat
- HOG Phantom Marauder Mask
- HOG Piercing

### Sample Matches

1. Army Helmet → APE Warlord's Combat Helmet
2. Backward Cap → APE Azure Crest Cap
3. Banana Peel → APE Toxic Spiked Peel
4. Bandana → APE Rugged Jungle Bandana
5. Beanie → APE Darkforce Beanie

---

## CLOTHING

| Metric | Count |
|--------|-------|
| Script.js traits | 93 |
| CSV traits | 47 |
| ✅ Matches | 38 |
| ❌ Missing in script.js | 9 |
| ❌ Unassociated traits | 0 |

### Missing in script.js

- Futuristic → Obsidiansteel Shadowplate (HOG Obsidiansteel Shadowplate)
- Mud spots → Eldritch Slime Patches (HOG Eldritch Slime Patches)
- Mc Polo → Shadowgrill Uniform (HOG Shadowgrill Uniform)
- Training Suit → Training (HOG Training)
- Suspender → Sleek Suspenders (HOG Sleek Suspenders)
- Samurai 2 → Obsidian Ronin Armor (HOG Obsidian Ronin Armor)
- Nirvana → Nirvana Embrace (HOG Nirvana Embrace)
- Samurai → Shadow Ronin Vanguard (HOG Shadow Ronin Vanguard)
- Army General → Shadow Legion Command Regalia (HOG Shadow Legion Command Regalia)

### Sample Matches

1. Caveman → HOG Stonehide Primalgarb
2. Polo → HOG Crimson Shadowweave
3. Basketball Shirt → HOG Infernal Decathlete Jersey
4. None → APE None
5. XRP Sweater → HOG Cryptoshade XRP Hoodie

---

## TUSK

| Metric | Count |
|--------|-------|
| Script.js traits | 15 |
| CSV traits | 16 |
| ✅ Matches | 14 |
| ❌ Missing in script.js | 2 |
| ❌ Unassociated traits | 1 |

### Missing in script.js

- Normal → Normal H (HOG Normal H)
- Silver Tusk → Silver Tusk (HOG Silver Tusks)

### Unassociated Traits

- HOG Moonshard Tusks

### Sample Matches

1. Bird → HOG Shadowcrest Nest
2. Wooden Tusk → HOG Ironbark Tusks
3. Gold → HOG Sovereign Fang Bone
4. Broken → HOG Broken Bone
5. Bronze Tusk → HOG Verdigris Fang

---
