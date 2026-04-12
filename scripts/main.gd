extends Node2D

const STAR_COUNT := 48
const STAR_SPEED_MIN := 18.0
const STAR_SPEED_MAX := 70.0
const SCREEN_SIZE := Vector2(320.0, 240.0)

var _stars: Array[Dictionary] = []


func _ready() -> void:
	randomize()
	_create_starfield()


func _process(delta: float) -> void:
	for star in _stars:
		star.position.y += star.speed * delta
		if star.position.y > SCREEN_SIZE.y:
			star.position.y = 0.0
			star.position.x = randf_range(0.0, SCREEN_SIZE.x)
	queue_redraw()


func _draw() -> void:
	for star in _stars:
		draw_rect(Rect2(star.position, Vector2(star.size, star.size)), star.color)


func _create_starfield() -> void:
	_stars.clear()
	for _i in STAR_COUNT:
		var brightness := randf_range(0.45, 1.0)
		_stars.append(
			{
				"position": Vector2(randf_range(0.0, SCREEN_SIZE.x), randf_range(0.0, SCREEN_SIZE.y)),
				"speed": randf_range(STAR_SPEED_MIN, STAR_SPEED_MAX),
				"size": [1.0, 1.0, 2.0].pick_random(),
				"color": Color(0.55 * brightness, 0.85 * brightness, brightness, 1.0),
			}
		)
