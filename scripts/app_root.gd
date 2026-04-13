extends Control

@export var gameplay_scene: PackedScene
@export var arcade_scene: PackedScene
@export var caravan_2_scene: PackedScene
@export var caravan_5_scene: PackedScene

const GAMEPLAY_SIZE := Vector2i(320, 240)
const TOP_BAR_VISIBLE_Y := 0.0
const TOP_REVEAL_ZONE := 20.0
const EDGE_GRAB := 10.0
const SETTINGS_MARGIN := 24.0
const COVER_INTRO_FADE_SECONDS := 2.0
const COVER_MUSIC_DELAY := 0.8
const COVER_TRACK_GAP_SECONDS := 10.0
const INTRO_CARD_DURATION := 1.45
const INTRO_TEXT_DURATION := 1.1
const INTRO_BUTTON_DURATION := 0.9
const COVER_BUTTON_REVEAL_DELAY := 10.0
const STORY_SCROLL_SPEED := 21.0
const STORY_AUTO_SCROLL_DELAY := 1.35
const STORY_MANUAL_SCROLL_PAUSE := 3.2
const STORY_OVERLAY_OPEN_DURATION := 0.24
const STORY_OVERLAY_CLOSE_DURATION := 0.18
const STORY_TV_ASPECT := 1536.0 / 1024.0
const STORY_POPUP_SCALE := 0.6
const STORY_POPUP_SIZE := Vector2(1536.0, 1024.0) * STORY_POPUP_SCALE
const STORY_POPUP_Y_OFFSET := -36.0
const STORY_DISPLAY_RECT := Rect2(200.0, 70.0, 1136.0, 785.0)
const STORY_TEXT_SAFE_RECT := Rect2(51.0, 195.0, 1034.0, 523.0)
const GOOD_ART_DIR := "res://artwork/title/good"
const EVIL_ART_DIR := "res://artwork/title/evil"
const FIXED_OPENING_ART_PATH := "res://artwork/title/good/title_good_01.png"
const FIXED_OPENING_TRACK := {"path": "res://audio/title/good/soldier_gun_title_theme_01.mp3", "duration": 38.0, "label": "Soldier Gun - Title Theme 1"}
const GOOD_TRACKS := [
	{"path": "res://audio/title/good/soldier_gun_title_theme_02.mp3", "duration": 182.0, "label": "Soldier Gun - Title Theme 2"},
	{"path": "res://audio/title/good/soldier_gun_title_cloudbreak.mp3", "duration": 176.0, "label": "Soldier Gun - Title: Cloudbreak Pursuit"},
	{"path": "res://audio/title/good/soldier_gun_title_dive_alarm.mp3", "duration": 40.0, "label": "Soldier Gun - Title: Dive Alarm"},
	{"path": "res://audio/title/good/soldier_gun_title_short_burst.mp3", "duration": 29.0, "label": "Soldier Gun - Title: Short Burst"},
	{"path": "res://audio/title/good/soldier_gun_title_flashpoint.mp3", "duration": 33.0, "label": "Soldier Gun - Title: Flashpoint Gate"},
	{"path": "res://audio/title/good/soldier_gun_title_signal_ping.mp3", "duration": 13.0, "label": "Soldier Gun - Title: Signal Ping"},
	{"path": "res://audio/title/good/soldier_gun_title_ready_tone.mp3", "duration": 14.0, "label": "Soldier Gun - Title: Ready Tone"},
	{"path": "res://audio/title/good/soldier_gun_ending_orbit_fall.mp3", "duration": 128.0, "label": "Soldier Gun - Ending: Orbit Fall"},
	{"path": "res://audio/title/good/soldier_gun_ending_frontier_embers.mp3", "duration": 77.0, "label": "Soldier Gun - Ending: Frontier Embers"},
	{"path": "res://audio/title/good/soldier_gun_ending_last_carrier.mp3", "duration": 97.0, "label": "Soldier Gun - Ending: Last Carrier"},
	{"path": "res://audio/title/good/soldier_gun_instrumental_starlane_drive.mp3", "duration": 112.0, "label": "Soldier Gun - Instrumental: Starlane Drive"},
	{"path": "res://audio/title/good/soldier_gun_instrumental_cloudline_run.mp3", "duration": 183.0, "label": "Soldier Gun - Instrumental: Cloudline Run"},
	{"path": "res://audio/title/good/soldier_gun_stage_03_arc_vale_breach_entry.mp3", "duration": 189.0, "label": "Soldier Gun - Stage 3: Arc Vale Breach // Entry"},
	{"path": "res://audio/title/good/soldier_gun_stage_03_arc_vale_breach_climb.mp3", "duration": 186.0, "label": "Soldier Gun - Stage 3: Arc Vale Breach // Climb"},
	{"path": "res://audio/title/good/soldier_gun_stage_03_arc_vale_breach_crossfire.mp3", "duration": 165.0, "label": "Soldier Gun - Stage 3: Arc Vale Breach // Crossfire"},
	{"path": "res://audio/title/good/soldier_gun_stage_03_arc_vale_breach_core_run.mp3", "duration": 179.0, "label": "Soldier Gun - Stage 3: Arc Vale Breach // Core Run"},
	{"path": "res://audio/title/good/soldier_gun_stage_04_meridian_fortress_assault.mp3", "duration": 186.0, "label": "Soldier Gun - Stage 4: Meridian Fortress // Assault"},
	{"path": "res://audio/title/good/soldier_gun_stage_04_meridian_fortress_descent.mp3", "duration": 157.0, "label": "Soldier Gun - Stage 4: Meridian Fortress // Descent"},
	{"path": "res://audio/title/good/soldier_gun_stage_04_meridian_fortress_breaker.mp3", "duration": 193.0, "label": "Soldier Gun - Stage 4: Meridian Fortress // Breaker"},
	{"path": "res://audio/title/good/soldier_gun_stage_05_astral_gate_entry.mp3", "duration": 147.0, "label": "Soldier Gun - Stage 5: Astral Gate // Entry"},
	{"path": "res://audio/title/good/soldier_gun_stage_05_astral_gate_breach.mp3", "duration": 84.0, "label": "Soldier Gun - Stage 5: Astral Gate // Breach"},
	{"path": "res://audio/title/good/soldier_gun_stage_05_astral_gate_orchestra_rise.mp3", "duration": 144.0, "label": "Soldier Gun - Stage 5: Astral Gate // Orchestra Rise"},
	{"path": "res://audio/title/good/soldier_gun_stage_05_astral_gate_orchestra_finale.mp3", "duration": 119.0, "label": "Soldier Gun - Stage 5: Astral Gate // Orchestra Finale"},
]
const EVIL_TRACKS := [
	{"path": "res://audio/title/evil/soldier_gun_omake_final_boss_hell_on_earth.mp3", "duration": 154.0, "label": "Soldier Gun - Omake: Final Boss // Hell on Earth"},
	{"path": "res://audio/title/evil/soldier_gun_omake_hell_on_earth_belzeboob_remix.mp3", "duration": 170.0, "label": "Soldier Gun - Omake: Hell on Earth // Belzeboob Remix"},
	{"path": "res://audio/title/evil/soldier_gun_omake_hell_on_earth_pce_tribute.mp3", "duration": 269.0, "label": "Soldier Gun - Omake: Hell on Earth // PCE Tribute"},
	{"path": "res://audio/title/evil/soldier_gun_omake_hell_on_earth_md_tribute.mp3", "duration": 317.0, "label": "Soldier Gun - Omake: Hell on Earth // MD Tribute"},
]

enum AppScreen {
	COVER,
	MENU,
	GAMEPLAY,
}

enum WindowState {
	WINDOWED,
	MAXIMIZED,
	FULLSCREEN,
}

var _current_screen := AppScreen.COVER
var _stars: Array[Dictionary] = []
var _game_instance: Node = null
var _current_mode_root: Node = null
var _top_bar_hidden_y := -28.0
var _top_bar_target_y := -28.0
var _drag_mode := ""
var _drag_anchor_pos := Vector2i.ZERO
var _drag_anchor_size := Vector2i.ZERO
var _drag_mouse_origin := Vector2i.ZERO
var _cover_phase := 0.0
var _menu_phase := 0.0
var _cover_intro_timer := 0.0
var _cover_track_timer := 0.0
var _cover_button_timer := 0.0
var _cover_music_started := false
var _cover_manual_stopped := false
var _current_track_duration := 38.0
var _current_track_label := "Soldier Gun - Title Theme 1"
var _art_cycle_queue: Array = []
var _good_track_queue: Array = []
var _evil_track_queue: Array = []
var _cover_history: Array = []
var _cover_history_index := -1
var _cover_actions_revealed := false
var _story_overlay_target_visible := false
var _story_overlay_progress := 0.0
var _story_scroll_target := 0.0
var _story_scroll_current := 0.0
var _story_auto_scroll_delay_timer := 0.0
var _story_manual_pause_timer := 0.0
var _story_internal_scroll_update := false
var _story_flicker_timer := 0.0
var _story_flicker_strength := 0.0
var _story_shimmer_phase := 0.0
var _restore_window_pos := Vector2i(120, 90)
var _restore_window_size := Vector2i(1280, 960)
var _normal_window_pos := Vector2i(120, 90)
var _normal_window_size := Vector2i(1280, 960)
var _window_state := WindowState.WINDOWED
var _state_before_fullscreen := WindowState.WINDOWED


func _ready() -> void:
	_randomize_shell()
	_setup_cover_rotation()
	_wire_ui()
	_apply_ui_tuning()
	_setup_window()
	_update_screen_visibility()
	_update_top_bar_layout()
	_center_settings_panel()
	_setup_story_overlay()
	_position_story_popup()
	_apply_scanlines()
	_reset_cover_intro()
	_apply_music_volume($SettingsPanel/SettingsPad/SettingsStack/MusicSlider.value)
	_sync_title_theme()
	queue_redraw()


func _process(delta: float) -> void:
	_animate_stars(delta)
	_cover_phase += delta
	_menu_phase += delta
	if _current_screen == AppScreen.COVER:
		_cover_intro_timer = minf(_cover_intro_timer + delta, COVER_INTRO_FADE_SECONDS)
		_cover_button_timer += delta
		if not _cover_manual_stopped:
			_cover_track_timer += delta
		if not _cover_manual_stopped and not _cover_music_started and _cover_intro_timer >= COVER_MUSIC_DELAY:
			$TitleThemePlayer.set_active(true)
			_cover_music_started = true
			_refresh_track_box()
		_refresh_track_box()
		if not _cover_manual_stopped and _cover_track_timer >= _current_track_duration + COVER_TRACK_GAP_SECONDS:
			_restart_cover_cycle()
		_update_story_auto_scroll(delta)
	_animate_cover_ui()
	_update_story_overlay_visuals(delta)
	_update_top_bar_target()
	$TopBar.position.y = lerpf($TopBar.position.y, _top_bar_target_y, minf(1.0, delta * 12.0))
	queue_redraw()


func _notification(what: int) -> void:
	if what == NOTIFICATION_RESIZED:
		_update_top_bar_layout()
		_center_settings_panel()
		_position_story_popup()


func _draw() -> void:
	for star in _stars:
		draw_rect(Rect2(star.position, Vector2(star.size, star.size)), star.color)


func _input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			_begin_resize_if_needed()
		else:
			_drag_mode = ""
	elif event is InputEventMouseMotion and _drag_mode != "":
		if _drag_mode == "move":
			_apply_move()
		else:
			_apply_resize()


func _unhandled_input(event: InputEvent) -> void:
	if not _story_overlay_target_visible and _story_overlay_progress <= 0.0:
		return
	if event.is_action_pressed("ui_cancel"):
		_toggle_story_popup(false)
		get_viewport().set_input_as_handled()
		return


func _randomize_shell() -> void:
	randomize()
	_stars.clear()
	for _i in 80:
		_stars.append(
			{
				"position": Vector2(randf_range(0.0, size.x), randf_range(0.0, size.y)),
				"speed": randf_range(16.0, 74.0),
				"size": [1.0, 1.0, 2.0].pick_random(),
				"color": Color(randf_range(0.35, 0.55), randf_range(0.55, 0.85), randf_range(0.75, 1.0), randf_range(0.35, 0.95)),
			}
		)


func _wire_ui() -> void:
	$TopBar.gui_input.connect(_handle_top_bar_input)
	$Screens/CoverScreen/ActionDock/ActionCard/ActionPad/ActionButtons/LaunchButton.pressed.connect(_show_menu)
	$Screens/CoverScreen/ActionDock/ActionCard/ActionPad/ActionButtons/StoryButton.pressed.connect(_toggle_story_popup.bind(true))
	$Screens/MenuScreen/MenuCenter/MenuStack/StartGameButton.pressed.connect(func(): _open_mode_scene(arcade_scene, "Arcade Mission"))
	$Screens/MenuScreen/MenuCenter/MenuStack/Caravan2Button.pressed.connect(func(): _open_mode_scene(caravan_2_scene, "2 Minute Caravan"))
	$Screens/MenuScreen/MenuCenter/MenuStack/Caravan5Button.pressed.connect(func(): _open_mode_scene(caravan_5_scene, "5 Minute Caravan"))
	$Screens/MenuScreen/MenuCenter/MenuStack/SettingsButton.pressed.connect(_toggle_settings.bind(true))
	$Screens/GameplayScreen/GameplayHud/BackToMenuButton.pressed.connect(_show_menu)
	$SettingsPanel/SettingsPad/SettingsStack/CloseSettingsButton.pressed.connect(_toggle_settings.bind(false))
	$SettingsPanel/SettingsPad/SettingsStack/FullscreenToggle.toggled.connect(_set_fullscreen)
	$SettingsPanel/SettingsPad/SettingsStack/ScanlineToggle.toggled.connect(func(_enabled: bool): _apply_scanlines())
	$SettingsPanel/SettingsPad/SettingsStack/ScanlineSlider.value_changed.connect(func(_value: float): _apply_scanlines())
	$SettingsPanel/SettingsPad/SettingsStack/MusicSlider.value_changed.connect(_apply_music_volume)
	$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/PrevTrackButton.pressed.connect(_play_previous_title_track)
	$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/PlayStopButton.pressed.connect(_toggle_title_playback)
	$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/NextTrackButton.pressed.connect(_play_next_title_track)
	$TopBar/TopBarPad/TopBarRow/OpenSettingsButton.pressed.connect(_toggle_settings.bind(true))
	$TopBar/TopBarPad/TopBarRow/TopFullscreenButton.pressed.connect(_flip_fullscreen)
	$TopBar/TopBarPad/TopBarRow/MinimizeButton.pressed.connect(func(): DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_MINIMIZED))
	$TopBar/TopBarPad/TopBarRow/MaximizeButton.pressed.connect(_toggle_maximize)
	$TopBar/TopBarPad/TopBarRow/CloseButton.pressed.connect(func(): get_tree().quit())
	$TopBar/TopBarPad.mouse_filter = Control.MOUSE_FILTER_IGNORE
	$TopBar/TopBarPad/TopBarRow.mouse_filter = Control.MOUSE_FILTER_IGNORE
	$TopBar/TopBarPad/TopBarRow/AppName.mouse_filter = Control.MOUSE_FILTER_IGNORE


func _setup_window() -> void:
	DisplayServer.window_set_flag(DisplayServer.WINDOW_FLAG_BORDERLESS, true)
	DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
	get_window().min_size = Vector2i(960, 720)
	DisplayServer.window_set_size(_normal_window_size)
	_center_window_on_primary_screen(_normal_window_size)
	$Screens/GameplayScreen/GameplayCenter/FrameRatio.custom_minimum_size = Vector2(640, 480)


func _apply_ui_tuning() -> void:
	_apply_font_size($TopBar/TopBarPad/TopBarRow/AppName, 12)
	for button: Button in [
		$TopBar/TopBarPad/TopBarRow/OpenSettingsButton,
		$TopBar/TopBarPad/TopBarRow/TopFullscreenButton,
		$TopBar/TopBarPad/TopBarRow/MinimizeButton,
		$TopBar/TopBarPad/TopBarRow/MaximizeButton,
		$TopBar/TopBarPad/TopBarRow/CloseButton,
	]:
		button.add_theme_font_size_override("font_size", 11)
		button.custom_minimum_size = Vector2(0, 22)

	for label: Label in [
		$Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryHeaderRow/StoryEyebrow,
		$Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryFooterLabel,
		$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/TrackRow/MusicHeader/MusicNotes,
		$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/TrackRow/TrackName,
		$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/TrackMeta,
		$Screens/MenuScreen/MenuCenter/MenuStack/MenuBanner/MenuPad/MenuText/MenuSubtitle,
		$Screens/MenuScreen/MenuCenter/MenuStack/MenuBanner/MenuPad/MenuText/MenuFlavor,
		$SettingsPanel/SettingsPad/SettingsStack/SettingsDesc,
		$SettingsPanel/SettingsPad/SettingsStack/CreatorLabel,
		$Screens/GameplayScreen/GameplayHud/ModeLabel,
	]:
		_apply_font_size(label, 12)

	_apply_font_size($Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryTitle, 24)
	$Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryScroll/StoryScrollPad/StoryScrollContent/StoryRichText.add_theme_font_size_override("normal_font_size", 16)
	$Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryScroll/StoryScrollPad/StoryScrollContent/StoryRichText.add_theme_constant_override("line_separation", 8)
	_apply_font_size($Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/TrackRow/MusicHeader/MusicTitle, 11)
	_apply_font_size($Screens/MenuScreen/MenuCenter/MenuStack/MenuBanner/MenuPad/MenuText/MenuTitle, 24)
	_apply_font_size($SettingsPanel/SettingsPad/SettingsStack/SettingsTitle, 22)

	for button: Button in [
		$Screens/CoverScreen/ActionDock/ActionCard/ActionPad/ActionButtons/StoryButton,
		$Screens/CoverScreen/ActionDock/ActionCard/ActionPad/ActionButtons/LaunchButton,
		$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/PrevTrackButton,
		$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/PlayStopButton,
		$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/NextTrackButton,
		$Screens/MenuScreen/MenuCenter/MenuStack/StartGameButton,
		$Screens/MenuScreen/MenuCenter/MenuStack/Caravan2Button,
		$Screens/MenuScreen/MenuCenter/MenuStack/Caravan5Button,
		$Screens/MenuScreen/MenuCenter/MenuStack/SettingsButton,
		$SettingsPanel/SettingsPad/SettingsStack/CloseSettingsButton,
		$Screens/GameplayScreen/GameplayHud/BackToMenuButton,
	]:
		button.add_theme_font_size_override("font_size", 14)
		if button.custom_minimum_size.y > 0.0:
			button.custom_minimum_size.y = maxf(34.0, button.custom_minimum_size.y * 0.72)
		if button in [
			$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/PrevTrackButton,
			$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/PlayStopButton,
			$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/NextTrackButton,
		]:
			button.custom_minimum_size.x = maxf(40.0, button.custom_minimum_size.x * 0.9)
			button.custom_minimum_size.y = 24.0
			button.add_theme_font_size_override("font_size", 12)

	for label: Label in [
		$SettingsPanel/SettingsPad/SettingsStack/ScanlineLabel,
		$SettingsPanel/SettingsPad/SettingsStack/MusicLabel,
	]:
		_apply_font_size(label, 13)

	for toggle: BaseButton in [
		$SettingsPanel/SettingsPad/SettingsStack/FullscreenToggle,
		$SettingsPanel/SettingsPad/SettingsStack/ScanlineToggle,
	]:
		toggle.add_theme_font_size_override("font_size", 13)


func _apply_font_size(control: Control, font_size: int) -> void:
	control.add_theme_font_size_override("font_size", font_size)


func _show_menu() -> void:
	_current_screen = AppScreen.MENU
	$SettingsPanel.visible = false
	_story_overlay_target_visible = false
	$Screens/CoverScreen/StoryBackdrop.hide()
	$Screens/CoverScreen/StoryPopup.hide()
	$Screens/CoverScreen/StoryTVFrame.hide()
	_cover_track_timer = 0.0
	_cover_manual_stopped = false
	_update_screen_visibility()
	_sync_title_theme()


func _open_mode_scene(scene: PackedScene, mode_name: String) -> void:
	_current_screen = AppScreen.GAMEPLAY
	$Screens/GameplayScreen/GameplayHud/ModeLabel.text = mode_name
	_load_mode_scene(scene)
	_update_screen_visibility()
	_sync_title_theme()


func _toggle_settings(visible: bool) -> void:
	$SettingsPanel.visible = visible
	if visible:
		_top_bar_target_y = TOP_BAR_VISIBLE_Y
		$TopBar.position.y = TOP_BAR_VISIBLE_Y
		_center_settings_panel()


func _set_fullscreen(enabled: bool) -> void:
	if enabled:
		if _window_state == WindowState.FULLSCREEN:
			return
		if _window_state == WindowState.WINDOWED:
			_capture_normal_bounds()
		_state_before_fullscreen = _window_state
		if DisplayServer.window_get_mode() != DisplayServer.WINDOW_MODE_FULLSCREEN:
			DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
		_window_state = WindowState.FULLSCREEN
		_top_bar_target_y = _top_bar_hidden_y
		$TopBar.position.y = _top_bar_hidden_y
	else:
		if _window_state != WindowState.FULLSCREEN:
			return
		if _state_before_fullscreen == WindowState.MAXIMIZED:
			_window_state = WindowState.MAXIMIZED
			_top_bar_target_y = TOP_BAR_VISIBLE_Y
			$TopBar.position.y = TOP_BAR_VISIBLE_Y
		else:
			DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
			_window_state = WindowState.WINDOWED
			_restore_normal_bounds()
	_sync_fullscreen_toggle()
	_update_top_bar_layout()


func _flip_fullscreen() -> void:
	_set_fullscreen(_window_state != WindowState.FULLSCREEN)


func _toggle_maximize() -> void:
	if _window_state == WindowState.MAXIMIZED:
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
		_window_state = WindowState.WINDOWED
		_restore_normal_bounds()
		_top_bar_target_y = _top_bar_hidden_y
		_sync_fullscreen_toggle()
	elif _window_state == WindowState.FULLSCREEN:
		_window_state = WindowState.MAXIMIZED
		_top_bar_target_y = TOP_BAR_VISIBLE_Y
		$TopBar.position.y = TOP_BAR_VISIBLE_Y
		_sync_fullscreen_toggle()
	else:
		_capture_normal_bounds()
		_window_state = WindowState.MAXIMIZED
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
		_top_bar_target_y = TOP_BAR_VISIBLE_Y
		$TopBar.position.y = TOP_BAR_VISIBLE_Y
	_update_top_bar_layout()


func _load_mode_scene(scene: PackedScene) -> void:
	if scene == null:
		return
	if _current_mode_root != null:
		_current_mode_root.queue_free()
		_current_mode_root = null
	if _game_instance != null:
		_game_instance.queue_free()
		_game_instance = null
	if scene == gameplay_scene:
		_ensure_game_loaded()
		return
	_current_mode_root = scene.instantiate()
	$Screens/GameplayScreen/GameplayCenter/FrameRatio/FramePanel/FrameMargin/GameViewportContainer/GameViewport.add_child(_current_mode_root)


func _ensure_game_loaded() -> void:
	if _game_instance != null:
		return
	_game_instance = gameplay_scene.instantiate()
	$Screens/GameplayScreen/GameplayCenter/FrameRatio/FramePanel/FrameMargin/GameViewportContainer/GameViewport.add_child(_game_instance)


func _update_screen_visibility() -> void:
	$Screens/CoverScreen.visible = _current_screen == AppScreen.COVER
	$Screens/MenuScreen.visible = _current_screen == AppScreen.MENU
	$Screens/GameplayScreen.visible = _current_screen == AppScreen.GAMEPLAY


func _update_top_bar_target() -> void:
	if $SettingsPanel.visible:
		_top_bar_target_y = TOP_BAR_VISIBLE_Y
		return
	if _window_state == WindowState.MAXIMIZED:
		_top_bar_target_y = TOP_BAR_VISIBLE_Y
		return
	var mouse_y := get_viewport().get_mouse_position().y
	_top_bar_target_y = TOP_BAR_VISIBLE_Y if mouse_y <= TOP_REVEAL_ZONE else _top_bar_hidden_y


func _update_top_bar_layout() -> void:
	$TopBar.size.x = size.x
	_top_bar_hidden_y = -($TopBar.size.y + 2.0)
	if $SettingsPanel.visible:
		_top_bar_target_y = TOP_BAR_VISIBLE_Y
		$TopBar.position.y = TOP_BAR_VISIBLE_Y
	elif _window_state == WindowState.MAXIMIZED:
		_top_bar_target_y = TOP_BAR_VISIBLE_Y
		$TopBar.position.y = TOP_BAR_VISIBLE_Y
	elif get_viewport().get_mouse_position().y > TOP_REVEAL_ZONE:
		_top_bar_target_y = _top_bar_hidden_y
		$TopBar.position.y = _top_bar_hidden_y


func _center_settings_panel() -> void:
	var panel: Control = $SettingsPanel
	var target_size := panel.custom_minimum_size
	var target_pos := (size - target_size) * 0.5
	target_pos.x = maxf(target_pos.x, SETTINGS_MARGIN)
	target_pos.y = maxf(target_pos.y, 72.0)
	panel.position = target_pos
	panel.size = target_size


func _setup_story_overlay() -> void:
	var popup: Control = $Screens/CoverScreen/StoryPopup
	var frame: TextureRect = $Screens/CoverScreen/StoryTVFrame
	var display: Panel = $Screens/CoverScreen/StoryPopup/StoryDisplay
	var shimmer: ColorRect = $Screens/CoverScreen/StoryPopup/StoryShimmer
	var tv_image := Image.load_from_file(ProjectSettings.globalize_path("res://artwork/Story Mode/TV.png"))
	if not tv_image.is_empty():
		frame.texture = ImageTexture.create_from_image(tv_image)
	frame.show()
	var rich_text: RichTextLabel = $Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryScroll/StoryScrollPad/StoryScrollContent/StoryRichText
	rich_text.text = _build_story_overlay_bbcode()
	var scroll_bar: VScrollBar = $Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryScroll.get_v_scroll_bar()
	scroll_bar.custom_minimum_size.x = 10
	scroll_bar.modulate = Color(0.58, 0.84, 1.0, 0.0)
	if not scroll_bar.value_changed.is_connected(_on_story_scrollbar_value_changed):
		scroll_bar.value_changed.connect(_on_story_scrollbar_value_changed)
	$Screens/CoverScreen/StoryBackdrop.hide()
	$Screens/CoverScreen/StoryPopup.hide()
	$Screens/CoverScreen/StoryTVFrame.hide()


func _position_story_popup() -> void:
	var popup: Control = $Screens/CoverScreen/StoryPopup
	var frame: TextureRect = $Screens/CoverScreen/StoryTVFrame
	var display: Panel = $Screens/CoverScreen/StoryPopup/StoryDisplay
	var content_pad: MarginContainer = $Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad
	var story_scroll: ScrollContainer = $Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryScroll
	var story_content: Control = $Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryScroll/StoryScrollPad/StoryScrollContent
	var story_rich_text: RichTextLabel = $Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryScroll/StoryScrollPad/StoryScrollContent/StoryRichText
	var popup_size := STORY_POPUP_SIZE
	var popup_position := ((size - popup_size) * 0.5).round()
	popup_position.y += STORY_POPUP_Y_OFFSET
	popup.position = popup_position
	popup.size = popup_size
	popup.pivot_offset = popup.size * 0.5
	frame.position = popup_position
	frame.size = popup_size
	frame.pivot_offset = frame.size * 0.5
	var display_rect := Rect2(
		STORY_DISPLAY_RECT.position * STORY_POPUP_SCALE,
		STORY_DISPLAY_RECT.size * STORY_POPUP_SCALE
	)
	var text_safe_rect := Rect2(
		STORY_TEXT_SAFE_RECT.position * STORY_POPUP_SCALE,
		STORY_TEXT_SAFE_RECT.size * STORY_POPUP_SCALE
	)
	display.position = display_rect.position.round()
	display.size = display_rect.size.round()
	content_pad.position = text_safe_rect.position.round()
	content_pad.size = text_safe_rect.size.round()
	var content_width: float = maxf(420.0, content_pad.size.x - 24.0)
	story_content.custom_minimum_size = Vector2(content_width, 0.0)
	story_rich_text.custom_minimum_size = Vector2(content_width, 0.0)
	story_scroll.custom_minimum_size = Vector2(0.0, maxf(160.0, content_pad.size.y - 108.0))
	$Screens/CoverScreen/StoryPopup/StoryShimmer.size = Vector2(display.size.x * 0.14, display.size.y)


func _toggle_story_popup(visible: bool) -> void:
	var popup: Control = $Screens/CoverScreen/StoryPopup
	if visible:
		_position_story_popup()
		_story_overlay_target_visible = true
		_story_overlay_progress = 0.0
		_story_auto_scroll_delay_timer = STORY_AUTO_SCROLL_DELAY
		_story_manual_pause_timer = 0.0
		_story_scroll_target = 0.0
		_story_scroll_current = 0.0
		_story_internal_scroll_update = true
		$Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryScroll.scroll_vertical = 0
		_story_internal_scroll_update = false
		$Screens/CoverScreen/StoryBackdrop.show()
		popup.show()
	else:
		_story_overlay_target_visible = false


func _update_story_auto_scroll(delta: float) -> void:
	return


func _update_story_overlay_visuals(delta: float) -> void:
	var popup: Control = $Screens/CoverScreen/StoryPopup
	var frame: TextureRect = $Screens/CoverScreen/StoryTVFrame
	var backdrop: ColorRect = $Screens/CoverScreen/StoryBackdrop
	var display: Panel = $Screens/CoverScreen/StoryPopup/StoryDisplay
	var shimmer: ColorRect = $Screens/CoverScreen/StoryPopup/StoryShimmer
	var target := 1.0 if _story_overlay_target_visible else 0.0
	var speed := 1.0 / (STORY_OVERLAY_OPEN_DURATION if _story_overlay_target_visible else STORY_OVERLAY_CLOSE_DURATION)
	_story_overlay_progress = move_toward(_story_overlay_progress, target, delta * speed)
	if _story_overlay_progress <= 0.0 and not _story_overlay_target_visible:
		backdrop.hide()
		popup.hide()
		frame.hide()
		return
	backdrop.show()
	popup.show()
	frame.show()
	var eased := smoothstep(0.0, 1.0, _story_overlay_progress)
	_story_flicker_timer -= delta
	if _story_flicker_timer <= 0.0:
		_story_flicker_timer = randf_range(3.0, 7.5)
		_story_flicker_strength = randf_range(-0.018, 0.022)
	_story_flicker_strength = lerpf(_story_flicker_strength, 0.0, minf(1.0, delta * 5.5))
	var panel_brightness := clampf(1.0 + _story_flicker_strength, 0.96, 1.04)
	backdrop.color = Color(0.0117647, 0.0196078, 0.0392157, 0.34 * eased)
	popup.modulate = Color(panel_brightness, panel_brightness, panel_brightness, eased)
	popup.scale = Vector2.ONE * lerpf(0.965, 1.0, eased)
	frame.modulate = Color(panel_brightness, panel_brightness, panel_brightness, eased)
	frame.scale = popup.scale
	_story_shimmer_phase = wrapf(_story_shimmer_phase + delta / 10.0, 0.0, 1.0)
	if _story_shimmer_phase < 0.22:
		var shimmer_width := maxf(96.0, display.size.x * 0.12)
		var travel := display.size.x + shimmer_width * 2.0
		shimmer.visible = true
		shimmer.modulate = Color(1, 1, 1, 0.18 * eased)
		shimmer.position = Vector2(display.position.x - shimmer_width + travel * (_story_shimmer_phase / 0.22), display.position.y)
		shimmer.size = Vector2(shimmer_width, display.size.y)
	else:
		shimmer.visible = false


func _adjust_story_scroll(amount: float) -> void:
	_set_story_scroll_target(_story_scroll_target + amount)


func _set_story_scroll_target(value: float) -> void:
	_story_manual_pause_timer = STORY_MANUAL_SCROLL_PAUSE
	_story_auto_scroll_delay_timer = 0.0
	_story_scroll_target = clampf(value, 0.0, _get_story_scroll_max())


func _get_story_scroll_max() -> float:
	var story_scroll: ScrollContainer = $Screens/CoverScreen/StoryPopup/StoryDisplay/StoryPopupPad/StoryPopupStack/StoryScroll
	var bar := story_scroll.get_v_scroll_bar()
	return maxf(0.0, bar.max_value - bar.page)


func _on_story_scrollbar_value_changed(value: float) -> void:
	if _story_internal_scroll_update:
		return
	_story_manual_pause_timer = STORY_MANUAL_SCROLL_PAUSE
	_story_auto_scroll_delay_timer = 0.0
	_story_scroll_target = value
	_story_scroll_current = value


func _build_story_overlay_bbcode() -> String:
	return """
[color=#86dfff][b]TV FRAME ONLINE[/b][/color]

[color=#d7e0e8]Version 1 replaces the old story window with the dedicated monitor shell asset and a calibrated internal display area. This layer is now constrained to the curved screen opening so future pages stay inside the glass.[/color]

[color=#f5cf77][b]NEXT PHASE[/b][/color]
[color=#d7e0e8]Version 2 will drive this display with the cinematic transmission sequence: CRT boot flash, static bursts, segmented pages, line-by-line reveals, and shutdown after the final page.[/color]

[color=#86dfff][b]STORY TARGETS LOCKED[/b][/color]
[color=#d7e0e8]The upcoming page system is ready to present [color=#cfeeff][b]REINA SOLARI (レイナ・ソラリ)[/b][/color], [color=#f5cf77][b]SOULSHUGAN[/b][/color], and the [color=#f5cf77][b]STELLAR DEVOURER[/b][/color] briefing inside the new TV display without touching the title screen artwork underneath.[/color]
"""


func _apply_scanlines() -> void:
	var overlay: Control = $Screens/GameplayScreen/GameplayCenter/FrameRatio/FramePanel/FrameMargin/ScanlineOverlay
	overlay.visible = $SettingsPanel/SettingsPad/SettingsStack/ScanlineToggle.button_pressed
	overlay.set("strength", $SettingsPanel/SettingsPad/SettingsStack/ScanlineSlider.value)
	overlay.queue_redraw()


func _apply_music_volume(value: float) -> void:
	$TitleThemePlayer.set_music_level(value)
	_refresh_track_box()


func _sync_title_theme() -> void:
	if _current_screen != AppScreen.COVER:
		$TitleThemePlayer.set_active(false)
		_cover_music_started = false
		_cover_manual_stopped = false


func _assign_rotating_title_art() -> void:
	_advance_cover_cycle()


func _reset_cover_intro(reset_actions: bool = true) -> void:
	_cover_intro_timer = 0.0
	_cover_track_timer = 0.0
	_cover_music_started = false
	$TitleThemePlayer.set_active(false)
	if reset_actions:
		_cover_button_timer = 0.0
		_cover_actions_revealed = false
		$Screens/CoverScreen/ActionDock.modulate = Color(1, 1, 1, 0)
	else:
		$Screens/CoverScreen/ActionDock.modulate = Color(1, 1, 1, 1)
	_refresh_track_box()


func _restart_cover_cycle() -> void:
	_advance_cover_cycle()


func _animate_stars(delta: float) -> void:
	for star in _stars:
		star.position.y += star.speed * delta
		if star.position.y > size.y + 2.0:
			star.position.y = -2.0
			star.position.x = randf_range(0.0, size.x)


func _animate_cover_ui() -> void:
	var action_dock: Control = $Screens/CoverScreen/ActionDock
	var action_card: Control = $Screens/CoverScreen/ActionDock/ActionCard
	var story_button: Button = $Screens/CoverScreen/ActionDock/ActionCard/ActionPad/ActionButtons/StoryButton
	var launch_button: Button = $Screens/CoverScreen/ActionDock/ActionCard/ActionPad/ActionButtons/LaunchButton
	var music_card: Control = $Screens/CoverScreen/MusicDock/MusicCard
	var music_notes: Label = $Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/TrackRow/MusicHeader/MusicNotes
	var track_name: Label = $Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/TrackRow/TrackName
	var track_meta: Label = $Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/TrackMeta
	var title_artwork: CanvasItem = $Screens/CoverScreen/TitleArtwork
	var title_overlay: CanvasItem = $Screens/CoverScreen/TitleOverlay
	var banner: Control = $Screens/MenuScreen/MenuCenter/MenuStack/MenuBanner
	var settings_anim: ColorRect = $SettingsPanel/SettingsPad/SettingsStack/SettingsAnimation

	var wave := sin(_cover_phase * 1.6)
	banner.scale = Vector2.ONE * (1.0 + sin(_menu_phase * 1.2) * 0.01)
	settings_anim.color = Color(0.129412, 0.192157 + abs(sin(_menu_phase * 2.1)) * 0.12, 0.298039 + abs(cos(_menu_phase * 1.5)) * 0.12, 1.0)
	if _current_screen == AppScreen.COVER:
		var card_alpha := _intro_progress(0.0, INTRO_CARD_DURATION)
		var button_alpha := 1.0 if _cover_actions_revealed else smoothstep(
			0.0,
			1.0,
			clampf((_cover_button_timer - COVER_BUTTON_REVEAL_DELAY) / maxf(INTRO_BUTTON_DURATION, 0.01), 0.0, 1.0)
		)
		if not _cover_actions_revealed and button_alpha >= 0.999:
			_cover_actions_revealed = true
			button_alpha = 1.0
		title_artwork.modulate = Color(1, 1, 1, card_alpha)
		title_overlay.modulate = Color(1, 1, 1, clampf(card_alpha * 0.92, 0.0, 1.0))
		action_dock.modulate = Color(1, 1, 1, button_alpha)
		action_card.scale = Vector2.ONE
		var button_wave := 0.5 + 0.5 * sin(_cover_phase * 2.0)
		var jitter_gate := pow(maxf(0.0, sin(_cover_phase * 0.9)), 18.0)
		var launch_tilt := sin(_cover_phase * 26.0) * 0.035 * jitter_gate
		launch_button.modulate = Color(1, 1, 1, button_alpha)
		launch_button.scale = Vector2.ONE * (1.0 + button_wave * 0.018 + jitter_gate * 0.01)
		launch_button.rotation = launch_tilt
		story_button.modulate = Color(1, 1, 1, button_alpha * 0.96)
		story_button.scale = Vector2.ONE
		story_button.rotation = 0.0
		music_card.modulate = Color(1, 1, 1, _intro_progress(1.05, 0.7))
		music_notes.text = "\u266B" if int(_cover_phase * 3.0) % 2 == 0 else "\u266A"
		music_notes.position.y = sin(_cover_phase * 4.2) * 2.0
		track_name.modulate = Color(1, 1, 1, 0.9 + button_wave * 0.08)
		track_meta.modulate = Color(1, 1, 1, 0.85 + button_wave * 0.1)
	else:
		title_artwork.modulate = Color.WHITE
		title_overlay.modulate = Color.WHITE
		action_card.scale = Vector2.ONE
		launch_button.scale = Vector2.ONE
		launch_button.rotation = 0.0
		story_button.scale = Vector2.ONE
		story_button.rotation = 0.0
		music_card.modulate = Color.WHITE
		music_notes.position.y = 0.0


func _intro_progress(delay: float, duration: float) -> float:
	return smoothstep(0.0, 1.0, clampf((_cover_intro_timer - delay) / maxf(duration, 0.01), 0.0, 1.0))


func _setup_cover_rotation() -> void:
	_build_art_cycle_queue()
	_refill_track_queue("good")
	_refill_track_queue("evil")
	_cover_history.clear()
	_cover_history_index = -1
	_apply_cover_entry({"art_path": FIXED_OPENING_ART_PATH, "mood": "good", "track": FIXED_OPENING_TRACK}, true)


func _build_art_cycle_queue() -> void:
	_art_cycle_queue.clear()
	for path in _list_title_art_paths(GOOD_ART_DIR):
		if path != FIXED_OPENING_ART_PATH:
			_art_cycle_queue.append({"path": path, "mood": "good"})
	for path in _list_title_art_paths(EVIL_ART_DIR):
		_art_cycle_queue.append({"path": path, "mood": "evil"})
	_art_cycle_queue.shuffle()


func _list_title_art_paths(directory_path: String) -> Array:
	var result: Array = []
	var dir := DirAccess.open(directory_path)
	if dir == null:
		push_warning("Could not open title art directory: %s" % directory_path)
		return result
	dir.list_dir_begin()
	while true:
		var file_name := dir.get_next()
		if file_name == "":
			break
		if dir.current_is_dir():
			continue
		var extension := file_name.get_extension().to_lower()
		if extension in ["png", "jpg", "jpeg", "webp"]:
			result.append("%s/%s" % [directory_path, file_name])
	dir.list_dir_end()
	result.sort()
	return result


func _refill_track_queue(mood: String) -> void:
	if mood == "evil":
		_evil_track_queue = EVIL_TRACKS.duplicate(true)
		_evil_track_queue.shuffle()
	else:
		_good_track_queue = GOOD_TRACKS.duplicate(true)
		_good_track_queue.shuffle()


func _take_next_art_entry() -> Dictionary:
	if _art_cycle_queue.is_empty():
		_build_art_cycle_queue()
	return _art_cycle_queue.pop_front()


func _take_next_track_for_mood(mood: String) -> Dictionary:
	if mood == "evil":
		if _evil_track_queue.is_empty():
			_refill_track_queue("evil")
		return _evil_track_queue.pop_front()
	if _good_track_queue.is_empty():
		_refill_track_queue("good")
	return _good_track_queue.pop_front()


func _generate_next_cover_entry() -> Dictionary:
	var art_entry := _take_next_art_entry()
	return {
		"art_path": String(art_entry["path"]),
		"mood": String(art_entry["mood"]),
		"track": _take_next_track_for_mood(String(art_entry["mood"])),
	}


func _apply_cover_entry(entry: Dictionary, remember: bool) -> void:
	var texture := _load_texture_from_image_path(String(entry["art_path"]))
	if texture != null:
		$Screens/CoverScreen/TitleArtwork.texture = texture
	var track: Dictionary = entry["track"]
	_current_track_duration = float(track["duration"])
	_current_track_label = String(track["label"])
	$TitleThemePlayer.set_audio_path(String(track["path"]))
	if remember:
		if _cover_history_index < _cover_history.size() - 1:
			_cover_history = _cover_history.slice(0, _cover_history_index + 1)
		_cover_history.append(entry.duplicate(true))
		_cover_history_index = _cover_history.size() - 1
	_refresh_track_box()


func _advance_cover_cycle() -> void:
	_apply_cover_entry(_generate_next_cover_entry(), true)
	_reset_cover_intro(false)


func _play_next_title_track() -> void:
	_cover_manual_stopped = false
	_advance_cover_cycle()


func _play_previous_title_track() -> void:
	if _cover_history_index <= 0:
		return
	_cover_manual_stopped = false
	_cover_history_index -= 1
	_apply_cover_entry(_cover_history[_cover_history_index], false)
	_reset_cover_intro(false)


func _toggle_title_playback() -> void:
	if _current_screen != AppScreen.COVER:
		return
	if $TitleThemePlayer.playing and not _cover_manual_stopped:
		_cover_manual_stopped = true
		_cover_music_started = false
		$TitleThemePlayer.set_active(false)
	else:
		_cover_manual_stopped = false
		_cover_music_started = false
		_cover_track_timer = 0.0
		$TitleThemePlayer.set_active(false)
	_refresh_track_box()


func _refresh_track_box() -> void:
	var playback_position := 0.0
	if not _cover_manual_stopped:
		playback_position = minf($TitleThemePlayer.get_playback_position_seconds(), _current_track_duration)
	$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/TrackRow/TrackName.text = _current_track_label
	$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/TrackMeta.text = "%s - %s" % [_format_duration(playback_position), _format_duration(_current_track_duration)]
	$Screens/CoverScreen/MusicDock/MusicCard/MusicPad/MusicStack/MusicControls/PlayStopButton.text = "Play" if _cover_manual_stopped or not $TitleThemePlayer.playing else "Stop"


func _format_duration(seconds: float) -> String:
	var total := int(round(seconds))
	var minutes := int(total / 60)
	var secs := total % 60
	return "%02d:%02d" % [minutes, secs]


func _load_texture_from_image_path(path: String) -> Texture2D:
	var image := Image.new()
	if image.load(path) != OK:
		push_warning("Could not load title artwork: %s" % path)
		return null
	return ImageTexture.create_from_image(image)


func _begin_resize_if_needed() -> void:
	if DisplayServer.window_get_mode() != DisplayServer.WINDOW_MODE_WINDOWED or _drag_mode == "move" or _window_state != WindowState.WINDOWED:
		return
	var mouse := get_viewport().get_mouse_position()
	var window_size := DisplayServer.window_get_size()
	var horizontal := ""
	var vertical := ""
	if mouse.x <= EDGE_GRAB:
		horizontal = "l"
	elif mouse.x >= window_size.x - EDGE_GRAB:
		horizontal = "r"
	if mouse.y <= EDGE_GRAB:
		vertical = "t"
	elif mouse.y >= window_size.y - EDGE_GRAB:
		vertical = "b"
	_drag_mode = horizontal + vertical
	if _drag_mode == "":
		return
	_drag_anchor_pos = DisplayServer.window_get_position()
	_drag_anchor_size = window_size
	_drag_mouse_origin = DisplayServer.mouse_get_position()


func _handle_top_bar_input(event: InputEvent) -> void:
	if DisplayServer.window_get_mode() != DisplayServer.WINDOW_MODE_WINDOWED or _window_state != WindowState.WINDOWED:
		return
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			_drag_mode = "move"
			_drag_anchor_pos = DisplayServer.window_get_position()
			_drag_mouse_origin = DisplayServer.mouse_get_position()
		else:
			_drag_mode = ""


func _apply_move() -> void:
	var mouse_delta := DisplayServer.mouse_get_position() - _drag_mouse_origin
	DisplayServer.window_set_position(_drag_anchor_pos + mouse_delta)


func _capture_normal_bounds() -> void:
	_normal_window_pos = DisplayServer.window_get_position()
	_normal_window_size = DisplayServer.window_get_size()
	_restore_window_pos = _normal_window_pos
	_restore_window_size = _normal_window_size


func _restore_normal_bounds() -> void:
	DisplayServer.window_set_size(_normal_window_size)
	DisplayServer.window_set_position(_normal_window_pos)


func _center_window_on_primary_screen(target_size: Vector2i) -> void:
	var screen := DisplayServer.get_primary_screen()
	var usable_rect := DisplayServer.screen_get_usable_rect(screen)
	var centered_pos := usable_rect.position + (usable_rect.size - target_size) / 2
	_normal_window_pos = centered_pos
	_normal_window_size = target_size
	_restore_window_pos = centered_pos
	_restore_window_size = target_size
	DisplayServer.window_set_position(centered_pos)


func _sync_fullscreen_toggle() -> void:
	$SettingsPanel/SettingsPad/SettingsStack/FullscreenToggle.set_pressed_no_signal(_window_state == WindowState.FULLSCREEN)


func _apply_resize() -> void:
	var mouse_delta := DisplayServer.mouse_get_position() - _drag_mouse_origin
	var new_pos := _drag_anchor_pos
	var new_size := _drag_anchor_size

	if "l" in _drag_mode:
		new_pos.x += mouse_delta.x
		new_size.x -= mouse_delta.x
	elif "r" in _drag_mode:
		new_size.x += mouse_delta.x

	if "t" in _drag_mode:
		new_pos.y += mouse_delta.y
		new_size.y -= mouse_delta.y
	elif "b" in _drag_mode:
		new_size.y += mouse_delta.y

	new_size.x = max(new_size.x, int(get_window().min_size.x))
	new_size.y = max(new_size.y, int(get_window().min_size.y))
	DisplayServer.window_set_position(new_pos)
	DisplayServer.window_set_size(new_size)
	_normal_window_pos = new_pos
	_normal_window_size = new_size
	_restore_window_pos = new_pos
	_restore_window_size = new_size


