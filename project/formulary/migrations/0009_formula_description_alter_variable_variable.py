# Generated by Django 4.1.3 on 2022-12-04 17:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formulary', '0008_remove_variable_contains_alter_variable_variable'),
    ]

    operations = [
        migrations.AddField(
            model_name='formula',
            name='description',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='variable',
            name='variable',
            field=models.CharField(max_length=5),
        ),
    ]