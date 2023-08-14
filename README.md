# buried-city

Backup download at https://rentry.co/fpkk2

Buried City
===========

Modded by ArithSeq, based on BuriedTown 1.4.3. Commercial use is prohibited.

Buried City is very different from the official version, and player feedback generally says it is more difficult. Please carefully read the change log if you are from the official version.

Peripheral Edits
----------------

0\. Renamed APK package and changed icon for better distinctiveness.  
1\. Removed all Google Play functionality.  
2\. IAP auto unlocked.  
3\. Wall of Medals cheat function (Cheat affects UI and perks only, does not affect normal unlock).  
4\. Earn and view Google Play achievements offline (unavailable if cheat talents are chosen).  
5\. Music and SFX toggles in settings.  
6\. Screen shrink in settings to make the UI compatible with longer phones.  
7\. Hall of Fame works offline (will record prior deaths).  
8\. All edits supports 13 languages (except this page)(thx chatGPT...)  
9\. Music sound quality improvement.  
10\. Main scene music selection button, music logic improvement.  
11\. Removed starting splash screen.  
12\. Change to Christmas background in Settings.  
13\. Change in-game map to city in Settings.  
14\. All pvr.ccz asset packs are unencrypted.  
15\. Removed useless codes and functionality.  

Game Edits
----------

1\. Removed character selection mechanism.  
2\. Unlocked machine tool, electric fence & stove, and minefield (electric fence & fence are combined).  
3\. New survival attributes: Thirst, Virus Load (see appendix).  
4\. Unlocked exclusive/unused items and drinking.  
5\. Mood affects gun accuracy (up to -60%), mood less than 5 can lead to suicide when losing stuff/after fight. Clothes can be damaged if hurt in combat. Excessive sleep will result in mood damage.  
6\. Home defense now combines, 081/chemical plant/electric fence/minefield no longer invincible to moonlighting. See appendix.  
7\. New talent: Survivor (reduced weapon damage), Hoarder (extra supply on start), Ingenuity (faster crafting & upgrading), Stealth (reduced zombie encounter & moonlighting), Backpacker (backpack capacity +30).  
8\. New cheat talent: Free IAP (unlimited free purchase from shop, radio CMD (see appendix)), All Unlock (all locations, all NPCs, full friendship, repeatable locations).  
9\. You can select multiple talents and the effects are combined.  
10\. If you're starving, HP will decrease. Power Plant won't be broken within 7 days of fixing. Reduced cost of generator parts.  
11\. NPC stealing functionality (see appendix).  
12\. "Survivor Bazaar" location, with new sweepstakes and hostel. (see appendix).  
13\. "W. White" NPC, who loves guns and will sell chemical products. Unlockable locations: Bandit Den, High School  
14\. Bandit will steal from your home if you own too much stuff and leave for too long. Defense will reduce the chance of this.  
15\. Weather forcast after Radio is crafted (view at status bar - weather), 16% that the weather forcast is wrong.  
16\. Ability to skip tutorial.  
17\. "Portal" location unlock after 081-12 (Bedroom) is completed. Completing will unlock endings.  
18\. Using item will take 10 minutes. Consuming coffee will make you reduce sleep quality for the next 6 hours. Consuming alcohol will reduce your gun accuracy for the next 12 hours (hours \* 2%).  
19\. Ad location is fixed and changed to "junkyard" where you can obtain free items given time.  
20\. Sending messages every 36 hours in Radio increases chance to find NPCs \[15 -> 30%\], messages now uses in-game time and saves.  
21\. Use Buff items from status bar - HP (heart).  
22\. View trade items from NPCs at map.  
23\. New item - Cheese: Obtainable at select locations and survivor bazaar. Effect is the reverse of soup - a lot of spirit and a bit of food.  
24\. Item weight & formula minor tweaks. Some locations have been lengthened.  
25\. Storeroom now pauses the timer.  
26\. Status bar shows electricity status.  
27\. Flashlight and detector must be equipped for the buff to take effect.  
28\. Dog feeding is now like stove, with max duration of 3 days. Dog shed must be constructed and the dog is at the museum.  
29\. Bullet and coffee bean has weight (0.02, min 1).  
30\. NPCs will come at the end of day to buy stuff from you at a really good price.  
31\. Fuel mechanism (gas station pump, pump part, new travel speed boost system, flamethrower). See appendix.  
32\. Top bar's talent button to show selected talents. If the number is gray, cheat is activated.  
33\. Weapon less prone to breaking early, and will return some parts if broken.  
34\. Attempted to fix bugs (negative weight, tutorial work bench, non-Chinese appliance glitch, zombie attack after dead, hang when moving all bullet/coffee from site storage, NPC value rounding error, multi-clickable crafting buttons, NPC ghost gun exploit, avoid zombie encounter by quitting the game).  

Appendix
--------

### Moonlighting：

Max difficulty: 131+ days, \[65, 75\], probability 50%.Formula: \[fence(30)+dog(10)+electric fence(40)\]+minefield(40). Location's defense has been improved.

### Radio CMD:

Only available if Cheat: Free IAP is selected.

heal - Heal the player on all aspect.

kill - Kill the player.

obtain Wood 100 - Obtain 100 wood.

obtain everything 100 - Obtain 100 of everything.

Available all times.

backup - Set the backup string for Achievement and Medal to the input prompt, ready to be copied.

restore {JSON} - Restore the JSON string to Achievement and Medal.

### NPC Stealing:

If stealing is successful, that NPC's alert increases by 1. If failed, the alert increases by 2, and friendship is reduced by 2 (Communicator -1, Cheat: All Unlocked: -0). Your luck is updated daily \[35, 65\], and it will affect the success rate. If not stolen from the NPC's alert will decrease by 1 per day.

### Survivor Bazaar:

A location where you can sell items in your bag for coins (cap 99999 coins), and buy items which refreshes every day. Items can be previewed in map. Sweepstakes are available in the Bazaar. Hostel allows you to sleep and rest at a fee.

### Thirst:

The player will drink water automatically from storage or the bag, once every 6 hours (Summer: 3 hours). Each drink will provide thirst immunity for the next 6 hours. If there is no immunity, 3 thirsts are deducted every hour. If thirst is lower than 25, you will lose 20 hp per hour. If you obtain a water and thirst is not full, you will drink one. When arriving home, you will drink until your thirst is full. Excessive amounts will be converted to equivalent immune time.

### Virus Load:

Every time you are hurt from a zombie combat with difficulty greater than 2, you risk gaining 1 virus (zombie encounters on the map during daytime: 1-2, nighttime: 3-4). If the virus is overloaded, you will die instantly. Virus will not decrease, but you can increase the upper bound of virus load by sacrificing other properties. All properties except hp can be exchanged for virus load 5:20, and hp can be exchanged 10:20. Wearing clothes can reduce the chance of gaining virus. Added Experimental Antidote: Provide immunity for virus load for 72 hours, obtainable at Dr. Jane.

### Fuel Mechanism:

Player can fix the pump at the gas station with gas pump part. When fixed, pump will provide 1 fuel per hour. Fuel cannot be sold and have a cap of 99. fuel will be used during motorcycle travel, which will significantly boost the player's speed. Falcon has been removed, the engine/buffs repurposed for/to the normal motorcycle. Shoes now break after a fixed distance have been traveled. If the player have shoes, shoes will be automatically used to provide a small speed boost. If the player have motorcycles, motorcycle's storage space boost will be used. If the player also has fuel, speed boost will be provided. New weapon: Flamethrower, damage all enemies by consuming 1 fuel per turn. if >3 zombies are present, each are delt 30 damage. if more than 1 zombie is present, each are delt 60 damage. If 1 zombie is present, 120 damage is delt. You might encounter abandoned cars when traveling. If equipped with siphoning tool (craftable at the bench), you will receive fuel.
