extends AudioStreamPlayer

@export var fade_in_seconds := 2.0
@export var fade_out_seconds := 1.0
@export_file("*.mp3") var audio_path := "res://audio/title/soldier_gun_title_theme_01.mp3"

var _user_volume_linear := 0.72
var _fade_linear := 0.0
var _is_active := false
var _is_fading_out := false


func _ready() -> void:
	_load_mp3_stream()
	volume_db = linear_to_db(0.001)


func _process(delta: float) -> void:
	if not playing:
		return

	var length := stream.get_length() if stream != null else 0.0
	if _is_active and not _is_fading_out and length > fade_out_seconds and get_playback_position() >= length - fade_out_seconds:
		_begin_fade_out()

	if _is_fading_out:
		_fade_linear = maxf(0.0, _fade_linear - (delta / maxf(fade_out_seconds, 0.01)))
		if _fade_linear <= 0.0001:
			stop()
			_is_fading_out = false
			_apply_volume()
			return
	else:
		_fade_linear = minf(1.0, _fade_linear + (delta / maxf(fade_in_seconds, 0.01)))

	_apply_volume()


func set_active(active: bool) -> void:
	_is_active = active
	if active:
		_start_from_intro()
	elif playing:
		_begin_fade_out()


func set_music_level(percent: float) -> void:
	_user_volume_linear = clampf(percent / 100.0, 0.001, 1.0)
	_apply_volume()


func set_audio_path(path: String) -> void:
	if audio_path == path and stream != null:
		return
	audio_path = path
	_load_mp3_stream()


func get_track_length_seconds() -> float:
	return stream.get_length() if stream != null else 0.0


func get_playback_position_seconds() -> float:
	return get_playback_position() if playing else 0.0


func _start_from_intro() -> void:
	_is_fading_out = false
	_fade_linear = 0.0
	if playing:
		stop()
	play()
	_apply_volume()


func _begin_fade_out() -> void:
	_is_fading_out = true
	_is_active = false


func _apply_volume() -> void:
	var final_linear := maxf(_user_volume_linear * _fade_linear, 0.001)
	volume_db = linear_to_db(final_linear)


func _load_mp3_stream() -> void:
	if not FileAccess.file_exists(audio_path):
		push_warning("Title theme MP3 not found at %s" % audio_path)
		stream = null
		return
	var mp3_stream := AudioStreamMP3.new()
	mp3_stream.data = FileAccess.get_file_as_bytes(audio_path)
	stream = mp3_stream
