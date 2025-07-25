# Generated by Django 5.1 on 2025-04-14 14:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0005_farmer_post_comment"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name="comment",
            name="farmer",
        ),
        migrations.RemoveField(
            model_name="post",
            name="likes",
        ),
        migrations.RemoveField(
            model_name="post",
            name="farmer",
        ),
        migrations.RenameField(
            model_name="comment",
            old_name="comment",
            new_name="content",
        ),
        migrations.AddField(
            model_name="comment",
            name="user",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="user",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="post",
            name="image",
            field=models.ImageField(
                default="post_images/default.jpg", upload_to="post_images/"
            ),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name="Like",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "post",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="likes",
                        to="app.post",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.DeleteModel(
            name="Farmer",
        ),
    ]
