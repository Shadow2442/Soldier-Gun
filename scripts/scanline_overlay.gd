extends Control

@export var strength := 0.25


func _draw() -> void:
	var line_alpha := clampf(strength, 0.0, 0.85)
	var shadow := Color(0.0, 0.0, 0.0, line_alpha)
	for y in range(0, int(size.y), 4):
		draw_rect(Rect2(0.0, float(y), size.x, 2.0), shadow)
