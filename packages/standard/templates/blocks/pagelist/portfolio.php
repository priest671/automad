<?php defined('AUTOMAD') or die('Direct access not permitted!'); ?>
<@ set { :hideThumbnails: @{ checkboxHideThumbnails } } @>
<div class="@{ :classes | def('cards masonry clean') }">
	<@ foreach in pagelist ~@>
		<div class="card" <@ ../../elements/colors_inline.php @>>
			<div class="card-content uk-panel small uk-panel-box">
				<@ if not @{ :hideThumbnails } and not @{ pageIconSvg } @>
					<@~ ../../elements/set_imageteaser_variable.php @>
					<@~ if @{ :imageTeaser } @>
						<div class="uk-panel-teaser">
							<a href="@{ url }"><img src="@{ :imageTeaser }"></a>
						</div>
					<@~ end ~@>
				<@ end @>
				<div class="uk-panel-title panel-body">
					<a href="@{ url }">
						<@ ../../elements/icon.php @>
						@{ title }
					</a>
					<div class="text-subtitle">
						<@ ../../elements/date.php @>
						<@ if @{ date } and @{ tags } @><br><@ end @>
						<@ ../../elements/tags.php @>
					</div>
				</div>
				<@ ../../elements/more.php @>
			</div>
		</div>
	<@ else @>
		<div class="card">
			<div class="card-content uk-panel uk-panel-box">
				<div class="uk-panel-title uk-margin-remove">
					@{ notificationNoSearchResults | def ('No Pages Found') }
				</div>
			</div>
		</div>
	<@~ end @>
</div>