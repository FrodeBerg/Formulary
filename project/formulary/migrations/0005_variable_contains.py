# Generated by Django 4.1.3 on 2022-11-30 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('formulary', '0004_alter_category_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='variable',
            name='contains',
            field=models.ManyToManyField(related_name='Products', to='formulary.variable'),
        ),
    ]
