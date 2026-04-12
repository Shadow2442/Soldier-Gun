extends Area2D

const SPEED := 300.0


func _ready() -> void:
	if has_node("VisibleOnScreenNotifier2D"):
		$VisibleOnScreenNotifier2D.screen_exited.connect(queue_free)


func _process(delta: float) -> void:
	position.y -= SPEED * delta
	queue_redraw()


func _draw() -> void:
	draw_rect(Rect2(-1.0, -6.0, 2.0, 12.0), Color(0.95, 1.0, 0.42, 1.0))
	draw_rect(Rect2(-2.0, -2.0, 4.0, 4.0), Color(0.31, 0.85, 1.0, 1.0))
