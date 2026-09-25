-- Datos: Godot 2D (godot-2d-xhiggs-xelda) pasa de 16 a 24 semanas.
-- Solo UPDATEs: no borra módulos, así se conservan videoUrl y GroupModuleRelease.
-- Precio completo 189 -> 249. OJO: NO desplegar a producción hasta añadir aquí
-- el nuevo stripePriceIdYearly (249 €), o la web mostrará 249 y Stripe cobrará 189.

UPDATE "Course"
SET "duracion" = '24 semanas', "horas" = 36, "precioCompleto" = 249
WHERE "slug" = 'godot-2d-xhiggs-xelda';

UPDATE "CourseModule" m
SET "semanas" = v.nuevo
FROM "Course" c,
     (VALUES
        ('Semanas 1-2',   'Semanas 1-3'),
        ('Semanas 3-4',   'Semanas 4-6'),
        ('Semanas 5-6',   'Semanas 7-9'),
        ('Semanas 7-8',   'Semanas 10-12'),
        ('Semanas 9-10',  'Semanas 13-15'),
        ('Semanas 11-12', 'Semanas 16-18'),
        ('Semanas 13-14', 'Semanas 19-21'),
        ('Semanas 15-16', 'Semanas 22-24')
     ) AS v(viejo, nuevo)
WHERE m."courseId" = c."id"
  AND c."slug" = 'godot-2d-xhiggs-xelda'
  AND m."semanas" = v.viejo;
