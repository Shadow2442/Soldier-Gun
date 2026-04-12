extends Control

@export var mode_name := "Mode"
@export var mode_subtitle := "Placeholder"
@export var mission_blurb := "Prototype mode shell."
@export var gameplay_scene: PackedScene

var _game_instance: Node = null


func _ready() -> void:
	$Overlay/ModeCard/ModePad/ModeStack/ModeTitle.text = mode_name
	$Overlay/ModeCard/ModePad/ModeStack/ModeSubtitle.text = mode_subtitle
	$Overlay/ModeCard/ModePad/ModeStack/ModeBlurb.text = mission_blurb
	_load_gameplay()


func _load_gameplay() -> void:
	if gameplay_scene == null or _game_instance != null:
		return
	_game_instance = gameplay_scene.instantiate()
	$Layer/ViewportContainer/SubViewport.add_child(_game_instance)
