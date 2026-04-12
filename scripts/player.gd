extends Node2D

const BULLET_SCENE := preload("res://scenes/player_bullet.tscn")
const SCREEN_SIZE := Vector2(320.0, 240.0)
const SPEED := 180.0
const FIRE_INTERVAL := 0.09

var _fire_cooldown := 0.0
var _flash_timer := 0.0


func _process(delta: float) -> void:
	_handle_movement(delta)
	_handle_actions(delta)
	queue_redraw()


func _draw() -> void:
	var body_color := Color(0.31, 0.85, 1.0, 1.0)
	var accent_color := Color(0.95, 1.0, 0.42, 1.0)
	var engine_color := Color(1.0, 0.37, 0.37, 1.0)

	if _flash_timer > 0.0:
		body_color = body_color.lerp(Color.WHITE, 0.4)
		accent_color = accent_color.lerp(Color.WHITE, 0.4)

	draw_polygon(
		PackedVector2Array(
			[
				Vector2(0, -14),
				Vector2(10, 8),
				Vector2(4, 4),
				Vector2(0, 9),
				Vector2(-4, 4),
				Vector2(-10, 8),
			]
		),
		PackedColorArray([body_color])
	)
	draw_polygon(
		PackedVector2Array([Vector2(0, -8), Vector2(4, 3), Vector2(0, 1), Vector2(-4, 3)]),
		PackedColorArray([accent_color])
	)
	draw_rect(Rect2(-3, 8, 6, 6), engine_color)


func _handle_movement(delta: float) -> void:
	var input_vector := Input.get_vector("move_left", "move_right", "move_up", "move_down")
	position += input_vector * SPEED * delta
	position.x = clampf(position.x, 12.0, SCREEN_SIZE.x - 12.0)
	position.y = clampf(position.y, 16.0, SCREEN_SIZE.y - 14.0)


func _handle_actions(delta: float) -> void:
	_fire_cooldown = maxf(0.0, _fire_cooldown - delta)
	_flash_timer = maxf(0.0, _flash_timer - delta)

	if Input.is_action_pressed("fire") and _fire_cooldown <= 0.0:
		_fire()
		_fire_cooldown = FIRE_INTERVAL

	if Input.is_action_just_pressed("bomb"):
		_flash_timer = 0.12


func _fire() -> void:
	_flash_timer = 0.05
	for shot_offset in [-5.0, 5.0]:
		var bullet := BULLET_SCENE.instantiate()
		bullet.global_position = global_position + Vector2(shot_offset, -14.0)
		get_tree().current_scene.add_child(bullet)
