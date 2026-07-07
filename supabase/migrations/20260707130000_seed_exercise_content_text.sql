-- Add readable exercise body content for the MVP exercise interface

UPDATE public.exercises AS ex
SET content_text = v.content_text
FROM public.sections AS s
JOIN (
  VALUES
    (
      0,
      0,
      'Find a comfortable seat and soften your shoulders. Place one hand on your belly if that feels supportive.

Breathe in slowly through your nose for a count of four. Pause briefly. Exhale gently through your mouth for a count of six.

Repeat this cycle several times. Notice the ground beneath you and the air moving in and out. There is nothing you need to fix right now — only arrive in this moment.'
    ),
    (
      0,
      1,
      'Settle into a quiet space where you will not be interrupted. Close your eyes if that feels safe.

Begin at the top of your head and slowly move your attention down through your body — forehead, jaw, neck, shoulders, arms, chest, belly, legs, feet.

When you notice tension, breathe toward that area with kindness. You are not trying to change anything — only offering gentle awareness.'
    ),
    (
      0,
      2,
      'Think of a place, person, or memory that helps you feel a little more held or steady. It does not need to be perfect — only meaningful to you.

Write a few sentences about why this anchor matters. Describe what you see, hear, or feel when you return to it in your mind.

Keep this anchor close this week. You can return to it whenever grief feels overwhelming.'
    ),
    (
      1,
      0,
      'Grief rarely follows a predictable path. It may appear as fatigue, irritability, numbness, waves of sadness, or moments that feel almost normal.

Reflect on the past week. Where have you noticed grief showing up in your body, thoughts, or daily routines?

Write without editing yourself. Naming your experience can be a first step toward understanding it.'
    ),
    (
      1,
      1,
      'Emotions after loss often arrive in waves — sometimes unexpectedly, sometimes long after others expect you to be "better."

Recall a recent moment when a feeling caught you off guard. What happened just before it surfaced? What did you need in that moment?

There is no wrong answer. You are learning your own rhythm of feeling.'
    ),
    (
      2,
      0,
      'Choose one feeling that has been present lately — heaviness, anger, longing, guilt, or something harder to name.

Write the feeling at the top of your page. Underneath, list what it might be trying to tell you, without rushing to solve it.

Sometimes grief asks to be witnessed before it asks to be resolved.'
    ),
    (
      2,
      1,
      'Imagine grief as a visitor with something important to say. Write a short letter beginning with: "Dear Grief, I want you to know..."

Say what feels true today. You can be honest, uncertain, tender, or frustrated.

Keep this letter for yourself. You may want to revisit it as your relationship with grief evolves.'
    ),
    (
      3,
      0,
      'Connection does not have to be large to be real. Think of one person, place, ritual, or memory that still carries warmth.

Describe what makes it meaningful and how you might gently return to it this week — even in a small way.

Healing often grows through tiny, repeatable moments of belonging.'
    ),
    (
      3,
      1,
      'Choose one memory that still holds love, humor, beauty, or significance. Write the scene as vividly as you can.

What do you see, hear, smell, or feel? What made that moment matter?

Meaning does not erase loss — it can sit alongside it.'
    ),
    (
      4,
      0,
      'You have been building practices, language, and awareness through this course. Take a moment to notice what has shifted — even subtly.

Write a few lines about who you are becoming as you carry your loss forward. What do you want to remember about yourself on hard days?

Your story is still unfolding. This is one chapter, not the whole book.'
    )
) AS v(section_order, exercise_order, content_text)
  ON s.order_index = v.section_order
WHERE ex.section_id = s.id
  AND ex.order_index = v.exercise_order
  AND (ex.content_text IS NULL OR length(trim(ex.content_text)) = 0);
