
Buried City
===========

[![](https://img.shields.io/github/downloads/qwerfd2/buried-city/total?style=flat-square)](https://github.com/qwerfd2/buried-city/releases)

Modded by ArithSeq, based on BuriedTown 1.4.3. Commercial use is prohibited.

Buried City is very different from the official version, and player feedback generally says it is more difficult. Please read the change log carefully if you have played the official version before.

Derivative work is allowed provided you follow the License in `license.txt`.
------------------------------------------------------------------------------------------------

Peripheral Edits
----------------------

1\. Renamed installer package and changed the icon for distinctiveness.  
2\. Support multiple save files, and various save file management functionalities.  
3\. Removed all Google Play dependencies and functionalities.  
4\. IAP talents are now free to use.  
5\. 'Wall of Medals' cheat function (Cheat affects UI and perks only, does not affect normal progression).  
6\. Earn and view Google Play achievements in-game (cannot accumulate if cheat talents are chosen).  
7\. Music and SFX on-off switches in settings.  
8\. Screen shrink in settings to ensure UI compatibility with modern phone's aspect ratio.  
9\. 'Cemetery' works offline (will record prior deaths).  
10\. Removed all languages besides English and Chinese due to poor quality. Feel free to contribute by translating!  
11\. Music logic improvement, and replaced some music of the official soundtrack and added additional music. Credits are at the bottom of this page.  
12\. Removed splash screen.  
13\. Christmas background when the festival arrives.  
14\. Replaced in-game map for city aesthetic.  
15\. All pvr.ccz asset packs are decrypted for easier modding.  
16\. Removed unused codes and functionality.  

Game Edits
----------------

1\. Removed character selection mechanism. You are now playing as a 3rd party survivor, with every NPC unlockable.  
2\. Unlocked previously character-exclusive appliances (machine tool, electric fence, stove, and minefield). Combined electric fence and fence.  
3\. See appendix New survival attributes: Thirst and Virus Load.  
4\. Unlocked exclusive/unused items and drinking.  
5\. Mood affects gun accuracy (up to -48%), mood less than 5 can lead to suicide after moonlighting, fight, or bandit raid.  
6\. Clothes can be damaged if hurt in combat. Excessive sleep will result in mood damage.  
7\. See appendix Home defense across appliances now adds up, locations and some defences are no longer invincible to moonlighting.  
8\. New talent: Survivor (reduced weapon damage), Hoarder (start with extra supply), Ingenuity (faster crafting & upgrading), Stealth (reduced zombie encounter, moonlighting, and bandit raids), Backpacker (backpack capacity +30).  
9\. See appendix New cheat talent: Free IAP (unlimited free purchase from shop, radio CMD), All Unlock (all locations, all NPCs, full friendship, repeatable locations).  
10\. You can select multiple talents and the effects are combined.  
11\. If you're in extreme starvation, HP will decrease.  
12\. Power Plant won't break within the first 4 days, nor will it break between 9PM and 1AM. Reduced cost of generator parts.  
13\. See appendix NPC stealing functionality.  
14\. See appendix "Survivor Bazaar" location, with new sweepstakes, hostel, and item sell/buy functionality.  
15\. "W. White" NPC, who loves guns and will sell chemical products. Unlockable locations: Bandit Den (armed bandits inside), High School.  
16\. Bandit will raid your home if you own too much stuff and left home for too long. Defense will reduce the chance of raids. If all defenses are active, you won't be raided.  
17\. Weather forecast after Radio is crafted (view at top bar - weather), 16% chance that the weather forecast is wrong.  
18\. Ability to skip tutorial at the beginning.  
19\. "Portal" ultra hard location unlock after 081-12 (Bedroom) is completed. Completing this location will unlock endings.  
20\. Consuming coffee will reduce sleep quality for the next 6 hours. Consuming alcohol will reduce gun accuracy for the next 12 hours (hours \* 2%).  
21\. Storeroom and item swap page now pauses the timer, but using an item will take 10 minutes. Moving 4 weight takes a minute (ingenuity talent: 5 weight), and equipping takes a minute.  
22\. Ad location is now "junkyard" where you can obtain free stuff every day.  
23\. Sending messages every 36 hours in Radio increases the chance to find NPCs \[20 -> 40%\], messages now uses in-game time and will be saved.  
24\. Use Buff items from top bar - HP (heart).  
25\. View trade items for NPCs and Bazaar via the clipboard icon in the location popop.  
26\. New item - Cheese: Obtainable at select locations and survivor bazaar. Effect is similiar to soup - a lot of mood and a bit of food.  
27\. Item weight & formula minor tweaks. Some locations have been lengthened.  
28\. Status bar shows electricity status.  
29\. Flashlight and detector must be equipped in the new equipment slot for the buff to take effect.  
30\. See appendix Dog shed needs to be constructed and the dog is at the museum. Once constructed, player can bring dogs outside and aid in combat and resource gathering.  
31\. Bullet and coffee bean has weight (0.02, minimum weight 1).  
32\. NPCs will arrive at the end of day to buy stuff from you. If your friendship level is higher, you will get a better deal.  
33\. See appendix Fuel mechanism (gas station pump, pump part, new travel speed boost system, flamethrower).  
34\. Top bar's talent button that shows selected talents for this game. If the number is gray, one or more cheat is activated.  
35\. See appendix New item: Standard bullet.  
36\. New appliance: Safe. Deposit items to prevent stealing and moonlighting.  
37\. Weapon less prone to breaking early, and will return some parts if broken.  
38\. See appendix Food now has a chance of expiring, turning into fertilizer.  
39\. You can accelerate the Hare Trap using potato (12 hours).  
40\. Zombie encounter while traveling will get more difficult and frequent as time progresses.  
41\. You might encounter bandits, who will demand items/money. You can fight, capitulate, or try to escape.  
42\. Alcohol addiction: drinking might increase the requirement to drink in the future. Each season this will be reduced by 1.  
43\. New location when reaching high favorability with The Stranger：Aquarium，where you cannot use guns or explosive devices.  
44\. Balanced 'Communicator' skill: Will attract bandit robbery and theft.  
45\. Sub-zero temperature will accelerate infection. Winter temperature has been tweaked - during the blizzard, having both stove will still incur minor infection.  
46\. Attempted to fix bugs (negative weight, tutorial work bench, non-Chinese appliance glitch, zombie attack after dead, hang when moving all bullet/coffee from site storage, NPC value rounding error, multi-clickable crafting buttons, NPC ghost gun exploit, avoid zombie encounter by quitting the game, tutorial visual bugs).

Appendix
--------------

### Moonlighting

Max difficulty: 131+ days, \[65, 75\], probability 50%. Formula: \[ fence(30) + dog(10) + electric fence(40) \] + minefield(last line of defense, 40). Location's defense has been improved accordingly, but no location is invincible.

### Radio CMD

Only available if Cheat: Free IAP is selected:

heal - Heal the player and dog on all aspect.

kill - Kill the player.

fix - Fix generator and gas pump (if fixable).

obtain Wood 100 - Obtain 100 wood.

obtain everything 100 - Obtain 100 of everything.

Available all times:

backup - Set the backup string for Achievement and Medal to the input prompt, ready to be copied.

restore {JSON} - Restore the JSON string to Achievement and Medal.

### NPC Stealing

You can steal from NPC at their home. If stealing is successful, that NPC's alert increases by 1, and you keep the stolen goods. If failed, the alert increases by 2, and friendship is reduced by 2 (Communicator talent: -1, Cheat all unlocked: -0). Your luck is updated daily, and will affect the success rate. NPC's alert will decrease by 1 per day if you don't steal from them.

### Survivor Bazaar

A location where you can sell items in your bag for coins (max 99999 coins), and buy items which refreshes every day. Items can be previewed in map. If an item is discounted, a "sale" icon will appear in the popup. Sweepstakes are available in the Bazaar. Hostel allows you to sleep and rest for a fee.

### Thirst

The player will drink water automatically from storage or from the bag, once every 6 hours (Summer: 4 hours). Each drink will provide thirst immunity for the next time frame. If there is no immunity, 3 thirsts are deducted every hour. If thirst is lower than 25, you will lose 20 hp per hour. If you obtain water and thirst is not full, you will drink until it is replenished. When arriving at home, you will drink until your thirst is quenched. Excessive amounts will be converted to equivalent immune time.

### Virus Load

Every time you are hurt from a zombie combat with difficulty greater than 2, you risk gaining 1 virus. If the virus is overloaded, you will die instantly. Virus will not decrease, but you can increase the upper bound of virus load by sacrificing other attributes. All attributes except HP can be exchanged for virus load 5 to 15, and HP can be exchanged 10 to 15. Wearing clothes can reduce the chance of gaining virus. Added Experimental Antidote: Provide immunity for virus load for 72 hours, obtainable at Dr. Jane. When dead and first aid kit is used, virus load will be halved.

### Fuel Mechanism

Only applicable after the player obtains motorcycle. Player can fix the pump at the gas station with gas pump part. When fixed, pump will provide 1 fuel per hour. Fuel cannot be sold and have a cap of 99. fuel can be used during motorcycle travel, which will significantly boost the player's speed. Falcon has been removed, the engine/buffs repurposed for/to the normal motorcycle. Shoes now break after a fixed distance have been traveled. If the player have shoes, it will be automatically used to provide a small speed boost. If the player have motorcycles,the storage space boost will be used. If the player also has fuel & want to use it (you can disable speed boost by clicking the motorcycle status icon on the travel dialog), speed boost will be provided. New weapon: Flamethrower, damage all enemies by consuming 1 fuel per turn. if more than 3 zombies are present, each are delt 25 damage. if more than 1 zombie is present, each are delt 50 damage. If 1 zombie is present, 100 damage is delt. You might encounter abandoned cars when traveling. If equipped with siphoning tool (craftable at the bench), you will receive some fuel.

### Standard Bullet

Bullets obtained at locations and encounters will largely be standard bullets. Stanard bullet are unlikely to break the gun, has boosted accuracies, but can't be crafted. If you have standard bullets in your bag and it is set to priority, it will be used. If one kind of bullet is depleted, the other will be used automatically.

### Food Expiration

Different food have a different chance to expire at 1AM. Expired food will be converted to fertilizer to provide speed-up for crops (3 hours) or sold. Fridge with electricity can prevent food in home from expiring. Food in backpack and safe will not expire.

### Dog Outdoor

Dogs now has 3 attributes: Hunger, injury, and mood. Hunger will deplete in 48 hours. 1 meat gives 12 hours of food. Pat dog every day to receive mood bonus for both player and dog. Give dog toys to instantly gain mood. Dog can be injured during battle - use bandages to heal him. If any one of the three attributes is depleted, dog will not help guard the home or in battle. Dog will not die.

You can bring dog outside in the Dog Shed appliance screen. If outside, dog cannot protect home. While outside, dog can distract zombies, attack them, and help you find more supplies. If you decide to bring dog outside, a dog logo will appear on the topbar, allowing you to check their stats. If the logo is gray, dog is not providing benefit due to low attribute. If at home and dog shed is grayed out, it means that dog will not defend your home due to low attribute. You can name your dog.

FAQ
---------

**Q: I don't like the design of virus load! Can you make a version without it?**

A: No. Virus Load has been carefully balanced. If you play normally and sacrifice attributes accordingly, It will not be a barrier towards completion. If you want to be invincible, select the cheat talent and heal yourself using Radio CMD.

**Q: What's updated in this version?**

A: A common problem with my personal projects is that I don't do enough documentation. If you ask me what is updated for a specific version, I'm sorry, I don't know. This document is an accurate (?) description of everything that is new.

**Q: Why did you remove character selection and Falcon Bike?**

A: Offical game's design of multiple playable characters is largely profit-driven. Each IAP characters have deadly weaknesses yet contains unique content. Rather than sustaining the poorly thought-out system, I decided to use the exclusive contents to support a cohesive user experience. Falcon was probably designed as an IAP item, and was removed during the designing of Fuel Mechanism due to its conflict with the Mororcycle and general incoherence with the world setting.

**Q: Can you play Buried City on IOS and PC?**

A: Unfortunately, The official version released on these platforms have always been compiled by SpiderMonkey. I cannot obtain the platform-specific part of code, so I cannot make Buried City compatible. You can use Android emulators such as BlueStacks, or purchase an Android device.

**Q: This game is so hard, I'm always in need of materials! Can you make it easier?**

A: I will rebalance the affected features every time something new is added. As updates have been gradual, I believe the current balance is appropriate. The game is designed to be challenging, as you are in a zombie apocolypse. If you believe that something is not balanced, please let me know - just be ready for my rebuttal.

**Q: Can you add this item, or this location?**

A: Unless the items and locations have new functionality or unique attributes, they will not be added. Adding these things can take a lot of time (photoshopping, translating, balancing, etc). I believe in quality over quantity, so I won't design something if I do not have the willpower needed to do so.

**Q: Can you add more stories to the gameplay?**

A: I have 5+ years of game design experience, and I believe that traditional story structure is incompatible with survival games. It will only divide players - distracting survival-oriented players and barring story-oriented players with survival difficulties. Lore is okay, but unless I have the resource to do branching storyline, any more story will not help with the player experience.

**Q: How do I update the game?**

A: Visit the Rentry post, or GitHub Release, located in Main Menu - Thumb button. Install the downloaded APK and have fun!

**Q: I can write code/make artworks/do QA, is there anything I can help?**

A: There is so much. New functionality, locaion-specific maps like 081, unit testing for bugs... If you are passionate about this game, please contact me.

**Q: I want to make my own mod version, where should I start?**

A: APK is a ZIP file. Take a look inside, all the code is in the js files, easily editable. You can use png for assets, or use TexturePacker to compile spritesheets. I recommend the Diff Folder plugin for VSCode, you can use it to compare code differences between mods. At the end, don't forget to sign the APK using Apktool or MT Manager.

**Q: Can you mod the game according to my specification, or help me crack another game?**

A: No. These requests takes a lot of time to complete. I usually charge people for this, but I don't want to profit from this project. I might be able to help with other games depending on mood.

**Q: I have suggestions, opinions, or other requests. Can I contact you?**

A: Of course. If your questions are unanswered, you are welcomed to contact me through any methods inside Main Menu - Thumb button.

Music List
----------------

Destroyer - Sergey Cheremisinov  
Secrets and Lies - David Celeste  
The Reunion - Trevor Kowalski  
There Must Be - So Vea  
The Slow Shift - Gavin Luke  
In the Waiting - Johannes Bornlof  
Planting the Seeds - David Celeste  
Nordkap - Martin Landh  
Into the Forest I Go - David Celeste  
Incandescence - Silver Maple  
Sleepwalker I - Sergey Cheremisinov  
Tensor Bandage - Blue Wizard Studio  
Deep Corridor - Brambles  
Search and Flight - Sergey Cheremisinov  
恐惧边缘 - 罗杨  
死亡触手 - 罗杨  
废土 - 罗杨  
来一杯咖啡 - 罗杨  
最后的避难所 - 罗杨  
孤岛 - 罗杨  
穷途 - 罗杨  
末路 - 罗杨  

BuriedTown Factsheet
--------------------------

BuriedTown, originally named BerryTown, was developed by Chengdu 点犀 (DianXi) (Dice7) Network Co.Ltd and published by Beijing 乐动卓越 (LeDongZhuoYue) (Locojoy) Technology Co.Ltd. First launched on the iOS on Sep. 23rd, 2015, The game started its Android beta phase on Sep. 25th, 2015, and was released at Google Play on Nov. 23rd, 2015. The last update (1.4.3) was released on Jun. 27th, 2018, and the game server was shut down around late June, 2019.

Thanks to the game's weak online dependency, the majority of the functionality can be enjoyed offline, with the exception of leaderboards, In-App Purchases, and in-game radio.

Developed using Cocos2d-JS, the installation package of Buried Town is unprotected, source code not compiled nor obfuscated, making modifications extremely easy. Although the graphics have been encrypted, the process after obtaining the key (B29B3886-543224E4-71BDF6E3-9275C626) and edit tool (TexturePacker) is trivial (The encryption has been removed in this version). The game's save file is stored under root-only directory using an encrypted sqlite3 database, with the password (1a2b3c4d5fberrytown).
