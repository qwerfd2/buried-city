var cc = cc || {};
cc.Sprite.INDEX_NOT_INITIALIZED	= -1;
cc.TMX_ORIENTATION_HEX	= 0x1;
cc.TMX_ORIENTATION_ISO	= 0x2;
cc.TMX_ORIENTATION_ORTHO	= 0x0;
cc.Z_COMPRESSION_BZIP2	= 0x1;
cc.Z_COMPRESSION_GZIP	= 0x2;
cc.Z_COMPRESSION_NONE	= 0x3;
cc.Z_COMPRESSION_ZLIB	= 0x0;
cc.BLEND_DST	= 0x303;
cc.BLEND_SRC	= 0x1;
cc.DIRECTOR_IOS_USE_BACKGROUND_THREAD	= 0x0;
cc.DIRECTOR_MAC_THREAD	= 0x0;
cc.DIRECTOR_STATS_INTERVAL	= 0.1;
cc.ENABLE_BOX2_D_INTEGRATION	= 0x0;
cc.ENABLE_DEPRECATED	= 0x1;
cc.ENABLE_GL_STATE_CACHE	= 0x1;
cc.ENABLE_PROFILERS	= 0x0;
cc.ENABLE_STACKABLE_ACTIONS	= 0x1;
cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL	= 0x0;
cc.GL_ALL	= 0x0;
cc.LABELATLAS_DEBUG_DRAW	= 0x0;
cc.LABELBMFONT_DEBUG_DRAW	= 0x0;
cc.MAC_USE_DISPLAY_LINK_THREAD	= 0x0;
cc.MAC_USE_MAIN_THREAD	= 0x2;
cc.MAC_USE_OWN_THREAD	= 0x1;
cc.NODE_RENDER_SUBPIXEL	= 0x1;
cc.PVRMIPMAP_MAX	= 0x10;
cc.SPRITEBATCHNODE_RENDER_SUBPIXEL	= 0x1;
cc.SPRITE_DEBUG_DRAW	= 0x0;
cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP	= 0x0;
cc.TEXTURE_ATLAS_USE_VAO	= 0x1;
cc.USE_L_A88_LABELS	= 0x1;
cc.ACTION_TAG_INVALID	= -1;
cc.DEVICE_MAC	= 0x6;
cc.DEVICE_MAC_RETINA_DISPLAY	= 0x7;
cc.DEVICEI_PAD	= 0x4;
cc.DEVICEI_PAD_RETINA_DISPLAY	= 0x5;
cc.DEVICEI_PHONE	= 0x0;
cc.DEVICEI_PHONE5	= 0x2;
cc.DEVICEI_PHONE5_RETINA_DISPLAY	= 0x3;
cc.DEVICEI_PHONE_RETINA_DISPLAY	= 0x1;
cc.FILE_UTILS_SEARCH_DIRECTORY_MODE	= 0x1;
cc.FILE_UTILS_SEARCH_SUFFIX_MODE	= 0x0;
cc.FLIPED_ALL	= 0xe0000000;
cc.FLIPPED_MASK	= 0x1fffffff;
cc.IMAGE_FORMAT_JPEG	= 0x0;
cc.IMAGE_FORMAT_PNG	= 0x1;
cc.ITEM_SIZE	= 0x20;
cc.LABEL_AUTOMATIC_WIDTH	= -1;
cc.LINE_BREAK_MODE_CHARACTER_WRAP	= 0x1;
cc.LINE_BREAK_MODE_CLIP	= 0x2;
cc.LINE_BREAK_MODE_HEAD_TRUNCATION	= 0x3;
cc.LINE_BREAK_MODE_MIDDLE_TRUNCATION	= 0x5;
cc.LINE_BREAK_MODE_TAIL_TRUNCATION	= 0x4;
cc.LINE_BREAK_MODE_WORD_WRAP	= 0x0;
cc.MAC_VERSION_10_6	= 0xa060000;
cc.MAC_VERSION_10_7	= 0xa070000;
cc.MAC_VERSION_10_8	= 0xa080000;
cc.MENU_HANDLER_PRIORITY	= -128;
cc.MENU_STATE_TRACKING_TOUCH	= 0x1;
cc.MENU_STATE_WAITING	= 0x0;
cc.NODE_TAG_INVALID	= -1;

cc.ParticleSystem.TYPE_FREE = 0;
cc.ParticleSystem.TYPE_RELATIVE = 1;
cc.ParticleSystem.TYPE_GROUPED = 2;
cc.ParticleSystem.DURATION_INFINITY = -1;
cc.ParticleSystem.MODE_GRAVITY = 0;
cc.ParticleSystem.MODE_RADIUS = 1;
cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE = -1;
cc.ParticleSystem.START_RADIUS_EQUAL_TO_END_RADIUS = -1;

cc.PRIORITY_NON_SYSTEM_MIN	= -2147483647;
cc.ProgressTimer.TYPE_BAR	= 0x1;
cc.ProgressTimer.TYPE_RADIAL	= 0x0;
cc.RESOLUTION_MAC	= 0x1;
cc.RESOLUTION_MAC_RETINA_DISPLAY	= 0x2;
cc.RESOLUTION_UNKNOWN	= 0x0;
cc.TMX_TILE_DIAGONAL_FLAG	= 0x20000000;
cc.TMX_TILE_HORIZONTAL_FLAG	= 0x80000000;
cc.TMX_TILE_VERTICAL_FLAG	= 0x40000000;

cc.TEXT_ALIGNMENT_CENTER    = 1;
cc.TEXT_ALIGNMENT_RIGHT     = 2;
cc.TEXT_ALIGNMENT_LEFT      = 0;

cc.VERTICAL_TEXT_ALIGNMENT_TOP      = 0;
cc.VERTICAL_TEXT_ALIGNMENT_CENTER   = 1;
cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM   = 2;

cc.TOUCHES_ALL_AT_ONCE	= 0x0;
cc.TOUCHES_ONE_BY_ONE	= 0x1;
cc.TRANSITION_ORIENTATION_DOWN_OVER	= 0x1;
cc.TRANSITION_ORIENTATION_LEFT_OVER	= 0x0;
cc.TRANSITION_ORIENTATION_RIGHT_OVER	= 0x1;
cc.TRANSITION_ORIENTATION_UP_OVER	= 0x0;
cc.UNIFORM_COS_TIME	= 0x5;
cc.UNIFORM_MV_MATRIX	= 0x1;
cc.UNIFORM_MVP_MATRIX	= 0x2;
cc.UNIFORM_P_MATRIX	= 0x0;
cc.UNIFORM_RANDOM01	= 0x6;
cc.UNIFORM_SAMPLER	= 0x7;
cc.UNIFORM_SIN_TIME	= 0x4;
cc.UNIFORM_TIME	= 0x3;
cc.UNIFORM_MAX	= 0x8;
cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM	= 0x2;
cc.VERTICAL_TEXT_ALIGNMENT_CENTER	= 0x1;
cc.VERTICAL_TEXT_ALIGNMENT_TOP	= 0x0;
cc.OS_VERSION_4_0	= 0x4000000;
cc.OS_VERSION_4_0_1	= 0x4000100;
cc.OS_VERSION_4_1	= 0x4010000;
cc.OS_VERSION_4_2	= 0x4020000;
cc.OS_VERSION_4_2_1	= 0x4020100;
cc.OS_VERSION_4_3	= 0x4030000;
cc.OS_VERSION_4_3_1	= 0x4030100;
cc.OS_VERSION_4_3_2	= 0x4030200;
cc.OS_VERSION_4_3_3	= 0x4030300;
cc.OS_VERSION_4_3_4	= 0x4030400;
cc.OS_VERSION_4_3_5	= 0x4030500;
cc.OS_VERSION_5_0	= 0x5000000;
cc.OS_VERSION_5_0_1	= 0x5000100;
cc.OS_VERSION_5_1_0	= 0x5010000;
cc.OS_VERSION_6_0_0	= 0x6000000;
cc.ANIMATION_FRAME_DISPLAYED_NOTIFICATION	= 'CCAnimationFrameDisplayedNotification';
cc.CHIPMUNK_IMPORT	= 'chipmunk.h';
cc.ATTRIBUTE_NAME_COLOR	= 'a_color';
cc.ATTRIBUTE_NAME_POSITION	= 'a_position';
cc.ATTRIBUTE_NAME_TEX_COORD	= 'a_texCoord';
cc.ATTRIBUTE_NAME_TEX_COORD1 = "a_texCoord1";
cc.ATTRIBUTE_NAME_TEX_COORD2 = "a_texCoord2";
cc.ATTRIBUTE_NAME_TEX_COORD3 = "a_texCoord3";
cc.ATTRIBUTE_NAME_NORMAL = "a_normal";
cc.ATTRIBUTE_NAME_BLEND_WEIGHT = "a_blendWeight";
cc.ATTRIBUTE_NAME_BLEND_INDEX = "a_blendIndex";